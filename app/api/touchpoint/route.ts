import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_API_VERSION = '2024-02-15';
const DEFAULT_SOURCE = 'landing_page';
const DEFAULT_SIGNUP_PHASE = 'pre_event';
const TAG_MAX_LEN = 128;
const TOUCHPOINT_EVENT_NAME = 'landing_touchpoint';

interface TouchpointBody {
  email: string;
  phone?: string;
  source?: string;
  signup_phase?: string;
  language?: string;
  engagement_level?: string;
}

function sanitizeTag(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const t = value.trim().slice(0, TAG_MAX_LEN);
  return t || fallback;
}

function sanitizeLanguage(value: unknown): 'en' | 'es' {
  if (value === 'es' || value === 'en') return value;
  return 'en';
}

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

function extractDuplicateProfileIdFromError(err: unknown): string | undefined {
  if (!(err instanceof Error)) return undefined;
  try {
    const parsed = JSON.parse(err.message) as {
      errors?: Array<{ meta?: { duplicate_profile_id?: unknown } }>;
    };
    const duplicateProfileId = parsed.errors?.[0]?.meta?.duplicate_profile_id;
    return typeof duplicateProfileId === 'string' ? duplicateProfileId : undefined;
  } catch {
    return undefined;
  }
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
      try {
        await patchProfile(duplicateId, {
          properties,
          ...(patchPhoneOnConflict ? { phone_number: patchPhoneOnConflict } : {}),
        });
      } catch (err) {
        const conflictDuplicateId = extractDuplicateProfileIdFromError(err);
        if (conflictDuplicateId) {
          await patchProfile(conflictDuplicateId, { properties });
          return conflictDuplicateId;
        }
        throw err;
      }
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

async function createTouchpointEvent(params: {
  email: string;
  phone?: string;
  source: string;
  signupPhase: string;
  language: 'en' | 'es';
  touchedAt: string;
  engagementLevel?: string;
}) {
  try {
    const profileAttributes: Record<string, string> = { email: params.email };
    if (params.phone) {
      profileAttributes.phone_number = params.phone;
    }

    await klaviyoRequest('/events/', {
      data: {
        type: 'event',
        attributes: {
          properties: {
            source: params.source,
            signup_phase: params.signupPhase,
            language: params.language,
            touch_type: 'return_visit',
            touched_at: params.touchedAt,
            ...(params.engagementLevel ? { engagement_level: params.engagementLevel } : {}),
          },
          time: params.touchedAt,
          value: 0,
          value_currency: 'USD',
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: TOUCHPOINT_EVENT_NAME,
              },
            },
          },
          profile: {
            data: {
              type: 'profile',
              attributes: profileAttributes,
            },
          },
        },
      },
    });
  } catch (err) {
    console.warn('[touchpoint] Event skipped:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: TouchpointBody = await req.json();
    const { email, phone, engagement_level } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    const normalizedPhone = phone?.trim() ? normalizePhoneToE164(phone) : undefined;
    const source = sanitizeTag(body.source, DEFAULT_SOURCE);
    const signupPhase = sanitizeTag(body.signup_phase, DEFAULT_SIGNUP_PHASE);
    const language = sanitizeLanguage(body.language);
    const touchedAt = new Date().toISOString();

    const hasAnyListConfig = Boolean(
      process.env.KLAVIYO_LIST_ID_POSTEVENT ?? process.env.KLAVIYO_LIST_ID,
    );

    if (!process.env.KLAVIYO_API_KEY || !hasAnyListConfig) {
      return NextResponse.json({ message: 'Touchpoint tracked (dev mode)' }, { status: 200 });
    }

    const properties: Record<string, string> = {
      source,
      signup_phase: signupPhase,
      language,
      last_touchpoint: source,
      last_touch_at: touchedAt,
      ...(engagement_level ? { engagement_level: sanitizeTag(engagement_level, 'normal') } : {}),
    };

    await upsertProfile(email, normalizedPhone, properties, normalizedPhone);
    await createTouchpointEvent({
      email,
      phone: normalizedPhone,
      source,
      signupPhase,
      language,
      touchedAt,
      engagementLevel: engagement_level,
    });

    return NextResponse.json(
      {
        message: 'Touchpoint tracked',
        touchpoint: {
          source,
          signup_phase: signupPhase,
          language,
          last_touch_at: touchedAt,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('[touchpoint] Error:', err);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
