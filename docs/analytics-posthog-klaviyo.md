# Si Se Puede — Analytics & CRM (PostHog & Klaviyo)

This document describes what is tracked in **PostHog** vs **Klaviyo**, how consent works, and which events and properties to expect.

## High-level split

| System    | Role                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **PostHog** | Product analytics: page views, funnel steps, CTA clicks, errors, UTM on signup events, and `identify` after successful signup.   |
| **Klaviyo** | Marketing CRM: profile + list subscription, email/SMS consent, and `landing_touchpoint` events for signup and return visits.        |

## PostHog

### Where it runs

- **`app/components/PostHogProvider.tsx`** wraps the app (from `app/layout.tsx`) and initializes `posthog-js`.
- **`instrumentation-client.ts`** does not initialize PostHog; initialization stays in the provider so consent can be enforced.

### Consent (strict opt-in)

- Users see a banner: **Accept** / **Decline**, and can reopen choices via **Privacy**.
- PostHog is initialized with **`opt_out_capturing_by_default`** until the user accepts; then **`opt_in_capturing()`** runs.
- Consent is persisted in **localStorage** via **`app/components/posthogTracking.ts`** (`POSTHOG_CONSENT_STORAGE_KEY`).

### Automatic events (after consent)

- **`$pageview`** — automatic page view capture.
- **`$pageleave`** — automatic page leave capture.

### Custom events

| Event                         | When it fires                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `signup_form_started`         | First focus on signup email or phone field.                                   |
| `signup_submitted`            | User submits the signup form (before API result).                            |
| `signup_success`              | `/api/subscribe` returns success.                                              |
| `signup_error`                | Subscribe request fails; includes `error` in properties.                      |
| `landing_return_touch`        | Returning user (stored identity) with new source/phase/language after touchpoint API succeeds. |
| `cta_instagram_clicked`       | Instagram links; includes **`cta_location`** (e.g. header, footer, success UI). |
| `cta_back_to_signup_clicked`  | Link to **`#signup`** from the closing section.                               |
| `language_switched`           | User switches EN/ES in **`app/components/LanguageToggle.tsx`**.               |

CTAs on the server-rendered home page use **`app/components/TrackedLink.tsx`** to fire `posthog.capture` from the client.

### Signup event properties

Context comes from **`getSignupTrackingContext`** in **`app/components/signupTracking.ts`**:

- **`source`** — from `?source=` query param, or default `landing_page`.
- **`signup_phase`** — `event_day` if `source` is non-empty, else `pre_event`.
- **`language`** — `en` or `es` from the active locale.

When the URL includes UTM params, these are also attached to signup events:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`

Other properties where applicable:

- **`has_phone`** — on submit/success paths.
- **`error`** — on `signup_error`.

### Identity (`identify`)

After a successful signup, **`posthog.identify`** is called in **`app/components/SignupForm.tsx`** with the user’s **email** as the distinct ID, plus person properties such as `email`, `language`, `signup_phase`, `last_touchpoint`, and `has_phone`.

### Suggested funnel (PostHog UI)

Create a funnel insight manually:

1. `$pageview`
2. `signup_form_started`
3. `signup_submitted`
4. `signup_success`

If you can only use **one breakdown**, prefer **`utm_source`** for campaign attribution; use **`language`** once it appears on events after real traffic.

---

## Klaviyo

### Where it runs

- **Server-side only** in Next.js route handlers using **`KLAVIYO_API_KEY`** and a subscription list ID (`KLAVIYO_LIST_ID_POSTEVENT` preferred, `KLAVIYO_LIST_ID` fallback).

### Signup — `POST /api/subscribe` (`app/api/subscribe/route.ts`)

When Klaviyo is configured:

1. **Upsert profile** with properties including: `source`, `signup_phase`, `language`, `sms_marketing_opt_in`, `last_touchpoint`, `last_touch_at`.
2. **Subscribe to list** — email marketing subscription; **SMS** only when the user opted in and the phone is valid (normalized to E.164).
3. **Custom event** metric **`landing_touchpoint`** with **`touch_type: signup`** and properties: `source`, `signup_phase`, `language`, `touched_at`.

If Klaviyo env vars are missing, the route may return success in **dev mode** without calling Klaviyo.

### Return visit / touchpoint — `POST /api/touchpoint` (`app/api/touchpoint/route.ts`)

When a known profile returns with updated **`source`**, **`signup_phase`**, or **`language`** (client calls this from **`app/components/SignupGate.tsx`** after a successful prior signup):

1. **Profile patch** with updated touchpoint fields (and optional `engagement_level` if sent).
2. **`landing_touchpoint`** event with **`touch_type: return_visit`** and related properties.

---

## What is not duplicated

- **UTM fields** are attached to **PostHog** signup events on the client. The **subscribe** JSON body to Klaviyo sends **`source`**, **`signup_phase`**, and **`language`** — not the full UTM set unless you extend the API later.
- **PostHog** is gated by **analytics consent** in the browser. **Klaviyo** runs when the user completes signup and the server processes **`/api/subscribe`** or **`/api/touchpoint`** — separate from PostHog consent.

---

## Environment variables

| Variable                    | Used for                          |
| --------------------------- | --------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`   | PostHog project API key (browser). |
| `NEXT_PUBLIC_POSTHOG_HOST`  | PostHog API host (e.g. US or EU).  |
| `KLAVIYO_API_KEY`           | Klaviyo private API key (server).  |
| `KLAVIYO_LIST_ID_POSTEVENT` | Preferred target list for new opt-ins. |
| `KLAVIYO_LIST_ID`           | Fallback list for subscriptions if post-event list is unset. |

See **`.env.example`** in the repo for placeholders.

---

## Quick verification checklist

1. **Incognito** — no PostHog capture traffic until **Accept** on the consent banner.
2. After **Accept** — **`$pageview`** appears in PostHog Live / Activity.
3. Complete signup — sequence **`signup_form_started`** → **`signup_submitted`** → **`signup_success`**, plus **`identify`** tied to email.
4. Visit with **`?utm_source=...`** (and other UTM params) — confirm UTM properties on signup events in PostHog.
5. With Klaviyo configured — confirm profile on the list and **`landing_touchpoint`** events on signup and return visits as applicable.

---

## Exporting this document as PDF

Open this file in your editor or browser preview, then **Print → Save as PDF** (or paste into Google Docs and export as PDF).
