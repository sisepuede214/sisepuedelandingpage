# PostHog Tracking Setup

## Required environment variables

Use the values from your PostHog project settings:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

For EU data residency, set:

```bash
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Consent behavior

- Tracking is strict opt-in.
- No PostHog events are sent before consent is accepted.
- Users can open the privacy panel again and change their choice.

## Event taxonomy

| Event | Trigger | Key properties |
|---|---|---|
| `$pageview` | Auto-captured after consent | default PostHog page props |
| `$pageleave` | Auto-captured after consent | default PostHog page props |
| `signup_form_started` | First focus in signup form | `source`, `signup_phase`, `language`, `utm_*` |
| `signup_submitted` | Signup submit click | `source`, `signup_phase`, `language`, `utm_*`, `has_phone` |
| `signup_success` | Successful subscribe response | `source`, `signup_phase`, `language`, `utm_*`, `has_phone` |
| `signup_error` | Subscribe request fails | `source`, `signup_phase`, `language`, `utm_*`, `error` |
| `landing_return_touch` | Returning signed-up visitor touchpoint | `source`, `signup_phase` |
| `cta_instagram_clicked` | Instagram CTA links clicked | `cta_location` |
| `cta_back_to_signup_clicked` | Back-to-signup CTA clicked | `cta_location` |
| `language_switched` | User switches EN/ES | `from_locale`, `to_locale` |

Notes:
- `utm_*` includes `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.
- User identity is set on signup success via `posthog.identify(email, ...)`.

## Funnel setup in PostHog

Create one funnel insight in PostHog with these steps:

1. `$pageview`
2. `signup_form_started`
3. `signup_submitted`
4. `signup_success`

Recommended breakdowns:

- `utm_source`
- `utm_campaign`
- `language`
- `has_phone`

Recommended filters:

- Date range aligned to campaign windows
- Entry URL contains landing page path

Save the funnel in your launch dashboard for ongoing monitoring.
