import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_API_VERSION = '2024-02-15';

interface SubscribeBody {
  email: string;
  phone?: string;
  sms_consent?: boolean;
}

async function klaviyoRequest(path: string, body: unknown) {
  const apiKey = process.env.KLAVIYO_API_KEY;
  if (!apiKey) throw new Error('Klaviyo API key not configured');

  const res = await fetch(`${KLAVIYO_API_BASE}${path}`, {
    method: 'POST',
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

async function upsertProfile(email: string, phone?: string, smsConsent?: boolean) {
  const attributes: Record<string, unknown> = { email };
  if (phone) attributes.phone_number = phone;
  if (smsConsent !== undefined) attributes.sms_consent = smsConsent;

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
    // Profile already exists — extract the ID from the conflict response
    const data = await res.json();
    return data.errors?.[0]?.meta?.duplicate_profile_id as string | undefined;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(data));
  }

  const data = await res.json();
  return data.data?.id as string | undefined;
}

async function addProfileToList(profileId: string) {
  const listId = process.env.KLAVIYO_LIST_ID;
  if (!listId) throw new Error('Klaviyo List ID not configured');

  await klaviyoRequest(`/lists/${listId}/relationships/profiles/`, {
    data: [{ type: 'profile', id: profileId }],
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

    // If Klaviyo isn't configured yet, return success so the form still works in dev
    if (!process.env.KLAVIYO_API_KEY || !process.env.KLAVIYO_LIST_ID) {
      console.info('[subscribe] Klaviyo not configured — skipping. Email:', email);
      return NextResponse.json({ message: 'Subscribed (dev mode)' }, { status: 200 });
    }

    const profileId = await upsertProfile(email, phone, sms_consent);
    if (profileId) {
      await addProfileToList(profileId);
    }

    return NextResponse.json({ message: 'Subscribed' }, { status: 200 });
  } catch (err) {
    console.error('[subscribe] Error:', err);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
