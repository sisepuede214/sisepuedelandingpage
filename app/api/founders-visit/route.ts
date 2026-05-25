import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api';
const KLAVIYO_API_VERSION = '2024-02-15';
const FOUNDERS_PAGE_SOURCE = 'founders_page';
const FOUNDERS_VISIT_EVENT_NAME = 'founders_page_visit';
const TAG_MAX_LEN = 128;

interface FoundersVisitBody {
  email?: string;
  phone?: string;
  visitor_id?: string;
  language?: string;
  signup_phase?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
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

function sanitizeUtm(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const t = value.trim().slice(0, TAG_MAX_LEN);
  return t || undefined;
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

async function upsertProfileByEmail(
  email: string,
  phone: string | undefined,
  properties: Record<string, string>,
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
    body: JSON.stringify({ data: { type: 'profile', attributes } }),
  });

  if (res.status === 409) {
    const data = await res.json();
    const duplicateId = data.errors?.[0]?.meta?.duplicate_profile_id as string | undefined;
    if (duplicateId) {
      await klaviyoRequest(
        `/profiles/${duplicateId}/`,
        {
          data: {
            type: 'profile',
            id: duplicateId,
            attributes: { properties },
          },
        },
        'PATCH',
      );
    }
    return;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(data));
  }
}

async function upsertProfileByExternalId(externalId: string, properties: Record<string, string>) {
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
        attributes: { external_id: externalId, properties },
      },
    }),
  });

  if (res.status === 409) {
    const data = await res.json();
    const duplicateId = data.errors?.[0]?.meta?.duplicate_profile_id as string | undefined;
    if (duplicateId) {
      await klaviyoRequest(
        `/profiles/${duplicateId}/`,
        {
          data: {
            type: 'profile',
            id: duplicateId,
            attributes: { properties },
          },
        },
        'PATCH',
      );
    }
    return;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(data));
  }
}

async function createFoundersVisitEvent(params: {
  email?: string;
  phone?: string;
  externalId?: string;
  properties: Record<string, string>;
  touchedAt: string;
}) {
  const profileAttributes: Record<string, string> = {};
  if (params.email) profileAttributes.email = params.email;
  if (params.phone) profileAttributes.phone_number = params.phone;
  if (params.externalId) profileAttributes.external_id = params.externalId;

  await klaviyoRequest('/events/', {
    data: {
      type: 'event',
      attributes: {
        properties: params.properties,
        time: params.touchedAt,
        value: 0,
        value_currency: 'USD',
        metric: {
          data: {
            type: 'metric',
            attributes: { name: FOUNDERS_VISIT_EVENT_NAME },
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
}

export async function POST(req: NextRequest) {
  try {
    const body: FoundersVisitBody = await req.json();
    const language = sanitizeLanguage(body.language);
    const signupPhase = sanitizeTag(body.signup_phase, 'pre_event');
    const touchedAt = new Date().toISOString();

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const visitorId =
      typeof body.visitor_id === 'string' ? body.visitor_id.trim().slice(0, 128) : '';

    if (!email && !visitorId) {
      return NextResponse.json({ message: 'email or visitor_id required' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    if (!process.env.KLAVIYO_API_KEY) {
      return NextResponse.json({ message: 'Founders visit tracked (dev mode)' }, { status: 200 });
    }

    const eventProperties: Record<string, string> = {
      source: FOUNDERS_PAGE_SOURCE,
      signup_phase: signupPhase,
      language,
      touched_at: touchedAt,
      page: 'founders',
    };

    const utmFields = {
      utm_source: sanitizeUtm(body.utm_source),
      utm_medium: sanitizeUtm(body.utm_medium),
      utm_campaign: sanitizeUtm(body.utm_campaign),
      utm_term: sanitizeUtm(body.utm_term),
      utm_content: sanitizeUtm(body.utm_content),
    };
    for (const [key, value] of Object.entries(utmFields)) {
      if (value) eventProperties[key] = value;
    }

    const profileProperties: Record<string, string> = {
      visited_founders_page: 'true',
      founders_page_visited_at: touchedAt,
      last_touchpoint: FOUNDERS_PAGE_SOURCE,
      last_touch_at: touchedAt,
      language,
      signup_phase: signupPhase,
    };

    if (email) {
      const phone =
        typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim() : undefined;
      await upsertProfileByEmail(email, phone, profileProperties);
      await createFoundersVisitEvent({
        email,
        phone,
        properties: eventProperties,
        touchedAt,
      });
    } else {
      await upsertProfileByExternalId(visitorId, profileProperties);
      await createFoundersVisitEvent({
        externalId: visitorId,
        properties: { ...eventProperties, visitor_id: visitorId },
        touchedAt,
      });
    }

    return NextResponse.json(
      {
        message: 'Founders visit tracked',
        visit: { source: FOUNDERS_PAGE_SOURCE, language, last_touch_at: touchedAt },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('[founders-visit] Error:', err);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
