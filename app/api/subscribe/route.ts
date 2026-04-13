import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_API_VERSION = '2024-02-15';

const DEFAULT_SOURCE = 'landing_page';
const DEFAULT_SIGNUP_PHASE = 'pre_event';
const TAG_MAX_LEN = 128;

interface SubscribeBody {
  email: string;
  phone?: string;
  sms_consent?: boolean;
  source?: string;
  signup_phase?: string;
}

/** E.164 for Klaviyo. US: 10 digits or 11 starting with 1; or already + and 10–15 digits total. */
function normalizePhoneToE164(input: string | undefined): string | undefined {
  if (input === undefined) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 0) return undefined;

  if (trimmed.startsWith('+')) {
    if (digits.length >= 10 && digits.length <= 15) {
      return `+${digits}`;
    }
    return undefined;
  }

  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  return undefined;
}

function sanitizeTag(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const t = value.trim().slice(0, TAG_MAX_LEN);
  return t || fallback;
}

function profilePropertiesFromBody(body: SubscribeBody, smsOptIn: boolean): Record<string, string> {
  return {
    source: sanitizeTag(body.source, DEFAULT_SOURCE),
    signup_phase: sanitizeTag(body.signup_phase, DEFAULT_SIGNUP_PHASE),
    sms_marketing_opt_in: smsOptIn ? 'true' : 'false',
  };
}

async function klaviyoRequest(path: string, body: unknown, method: 'POST' | 'PATCH' = 'POST') {
  const apiKey = process.env.KLAVIYO_API_KEY;
  if (!apiKey) throw new Error('Klaviyo API key not configured');

  const res = await fetch(`${KLAVIYO_API_BASE}${path}`, {
    method,
    headers: {
      accept: 'application/json',
      revision: KLAVIYO_API_VERSION,
      'content-type': 'application/json',
      Authorization: `Klaviyo-API-Key ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok && res.status !== 202) {
    const data = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(data));
  }

  return res;
}

async function patchProfile(
  profileId: string,
  patch: { properties: Record<string, string>; phone_number?: string },
) {
  const attributes: Record<string, unknown> = { properties: patch.properties };
  if (patch.phone_number) {
    attributes.phone_number = patch.phone_number;
  }

  await klaviyoRequest(
    `/profiles/${profileId}/`,
    {
      data: {
        type: 'profile',
        id: profileId,
        attributes,
      },
    },
    'PATCH',
  );
}

async function upsertProfile(
  email: string,
  phone: string | undefined,
  properties: Record<string, string>,
  patchPhoneOnConflict: string | undefined,
) {
  const attributes: Record<string, unknown> = { email, properties };
  if (phone) attributes.phone_number = phone;

  const res = await fetch(`${KLAVIYO_API_BASE}/profiles/`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      revision: KLAVIYO_API_VERSION,
      'content-type': 'application/json',
      Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes,
      },
    }),
  });

  if (res.status === 409) {
    const data = await res.json();
    const duplicateId = data.errors?.[0]?.meta?.duplicate_profile_id as string | undefined;
    if (duplicateId) {
      await patchProfile(duplicateId, {
        properties,
        ...(patchPhoneOnConflict ? { phone_number: patchPhoneOnConflict } : {}),
      });
    }
    return duplicateId;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(data));
  }

  const data = await res.json();
  return data.data?.id as string | undefined;
}

/** Email + optional SMS marketing consent via Klaviyo Subscribe Profiles API (also adds to the list). */
async function subscribeProfilesToMarketing(
  email: string,
  listId: string,
  options: { phone?: string; smsOptIn: boolean },
) {
  const consentedAt = new Date().toISOString();

  const subscriptions: {
    email: { marketing: { consent: 'SUBSCRIBED'; consented_at: string } };
    sms?: { marketing: { consent: 'SUBSCRIBED'; consented_at: string } };
  } = {
    email: {
      marketing: {
        consent: 'SUBSCRIBED',
        consented_at: consentedAt,
      },
    },
  };

  if (options.smsOptIn && options.phone) {
    subscriptions.sms = {
      marketing: {
        consent: 'SUBSCRIBED',
        consented_at: consentedAt,
      },
    };
  }

  const profileAttributes: Record<string, unknown> = {
    email,
    subscriptions,
  };
  if (options.smsOptIn && options.phone) {
    profileAttributes.phone_number = options.phone;
  }

  await klaviyoRequest('/profile-subscription-bulk-create-jobs/', {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: 'sisepuede_landing',
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: profileAttributes,
            },
          ],
        },
      },
      relationships: {
        list: {
          data: {
            type: 'list',
            id: listId,
          },
        },
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: SubscribeBody = await req.json();
    const { email, phone, sms_consent } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    if (sms_consent) {
      if (!phone || !String(phone).trim()) {
        return NextResponse.json(
          { message: 'Phone number is required to receive SMS updates.' },
          { status: 400 },
        );
      }
      const normalizedAttempt = normalizePhoneToE164(phone);
      if (!normalizedAttempt) {
        return NextResponse.json(
          {
            message:
              'Enter a valid phone number. US: 10 digits or +1… . Include country code if outside the US.',
          },
          { status: 400 },
        );
      }
    }

    const normalizedPhone = phone?.trim() ? normalizePhoneToE164(phone) : undefined;
    const smsOptIn = Boolean(sms_consent && normalizedPhone);

    if (!process.env.KLAVIYO_API_KEY || !process.env.KLAVIYO_LIST_ID) {
      console.info('[subscribe] Klaviyo not configured — skipping. Email:', email);
      return NextResponse.json({ message: 'Subscribed (dev mode)' }, { status: 200 });
    }

    const listId = process.env.KLAVIYO_LIST_ID;
    const properties = profilePropertiesFromBody(body, smsOptIn);
    const phoneForKlaviyo = smsOptIn ? normalizedPhone : undefined;
    const patchPhoneOnConflict = phoneForKlaviyo;

    await upsertProfile(email, phoneForKlaviyo, properties, patchPhoneOnConflict);
    await subscribeProfilesToMarketing(email, listId, {
      phone: phoneForKlaviyo,
      smsOptIn,
    });

    return NextResponse.json({ message: 'Subscribed' }, { status: 200 });
  } catch (err) {
    console.error('[subscribe] Error:', err);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
