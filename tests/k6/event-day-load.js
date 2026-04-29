
/**
 * k6 load test — Event Day Simulation
 *
 * Models 2000+ attendees at a 5K run scanning a QR code, landing on the site,
 * and submitting the signup form. Each VU simulates one person's full journey.
 *
 * IMPORTANT: Each /api/subscribe call fans out to 3 sequential Klaviyo API
 * calls (upsert profile → subscribe → create event). Under heavy load Klaviyo
 * may return 429s that surface as 500s from your API. Watch the error logs.
 *
 * Usage:
 *   # 1. Add LOAD_TEST=true to Vercel env vars and redeploy (uses test Klaviyo list)
 *
 *   # 2. Hobby plan run — stays inside your current Vercel + Klaviyo limits
 *   BASE_URL=https://www.sisepuedeshop.com k6 run tests/k6/event-day-load.js
 *
 *   # 3. Capacity probe — run this after upgrading to Vercel Pro + Klaviyo paid
 *   BASE_URL=https://www.sisepuedeshop.com k6 run -e SCENARIO=capacity_probe tests/k6/event-day-load.js
 *
 * Event timeline modeled (total ~95 minutes):
 *   0–10m   Pre-race booth: early arrivals scan QR codes
 *   10–25m  Race in progress: almost nobody at the booth
 *   25–55m  Finishers start coming through — ramp up
 *   55–80m  Peak finish window — 2000 attendees compressed here
 *   80–90m  Tail-end stragglers
 *   90–95m  Wind-down
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// ---------------------------------------------------------------------------
// Custom metrics
// ---------------------------------------------------------------------------
const subscribeErrorRate = new Rate('subscribe_error_rate');
const touchpointErrorRate = new Rate('touchpoint_error_rate');
const subscribeDuration = new Trend('subscribe_duration_ms', true);
const successfulSignups = new Counter('successful_signups');

// ---------------------------------------------------------------------------
// Load shape
//
// Two scenarios — pick with: k6 run -e SCENARIO=capacity_probe  (default: hobby_plan)
//
// hobby_plan      — stays inside Vercel Hobby (12 concurrent) + Klaviyo free limits.
//                   Gives you real baseline latency, queue behavior, error handling.
//                   Run this now.
//
// capacity_probe  — ramps past your current plan ceilings on purpose so you can see
//                   exactly where things break before the event. Run this when you are
//                   ready to upgrade to Vercel Pro + Klaviyo paid.
// ---------------------------------------------------------------------------
const SCENARIO = __ENV.SCENARIO || 'hobby_plan';

const STAGES = {
  // Stays under 10 VUs — well within Vercel Hobby concurrency (12 max).
  // Tells you: baseline latency, whether 2000 people spread over 90 min is feasible,
  // and whether your error handling works cleanly.
  hobby_plan: [
    { duration: '3m', target: 3 },   // Warmup — shake out cold starts
    { duration: '5m', target: 8 },   // Realistic steady booth traffic
    { duration: '5m', target: 10 },  // Near the Vercel ceiling — watch p99 climb
    { duration: '5m', target: 6 },   // Back off — confirm recovery
    { duration: '2m', target: 0 },
  ],
  // Ramps past your plan limits — only meaningful after upgrading.
  capacity_probe: [
    { duration: '10m', target: 15 },
    { duration: '15m', target: 3 },
    { duration: '30m', target: 65 },
    { duration: '25m', target: 110 },
    { duration: '10m', target: 20 },
    { duration: '5m',  target: 0 },
  ],
};

export const options = {
  scenarios: {
    event_day: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: STAGES[SCENARIO],
      gracefulRampDown: '60s',
    },
  },

  thresholds: {
    subscribe_duration_ms: ['p(95)<4000', 'p(99)<8000'],
    http_req_failed: ['rate<0.05'],
    subscribe_error_rate: ['rate<0.05'],
  },
};

// ---------------------------------------------------------------------------
// Config — override with env vars
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// ---------------------------------------------------------------------------
// Realistic user data pools
// ---------------------------------------------------------------------------
const FIRST_NAMES = [
  'Maria', 'Jose', 'Carlos', 'Ana', 'Luis', 'Sofia', 'Miguel', 'Isabella',
  'David', 'Valentina', 'Juan', 'Camila', 'Diego', 'Lucia', 'Roberto',
  'Emily', 'James', 'Sarah', 'Michael', 'Ashley', 'Alejandro', 'Gabriela',
  'Fernando', 'Monica', 'Ricardo', 'Patricia', 'Jorge', 'Diana', 'Andres',
  'Cristina',
];
const LAST_NAMES = [
  'Garcia', 'Martinez', 'Lopez', 'Hernandez', 'Gonzalez', 'Rodriguez',
  'Wilson', 'Johnson', 'Smith', 'Brown', 'Davis', 'Miller', 'Perez',
  'Ramirez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Ortiz', 'Gutierrez',
];
const EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

// Skew heavily toward Spanish — this is a Latino brand
const LANGUAGES = ['es', 'es', 'es', 'en'];

// Event-specific sources — where did the person encounter the QR code?
const SOURCES = [
  'event_finish_line_qr',
  'event_booth_qr',
  'event_banner_qr',
  'event_staff_handout',
  'event_flyer',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function pick(arr) {
  return arr[randomIntBetween(0, arr.length - 1)];
}

function randomEmail(first, last) {
  const tag = randomIntBetween(1, 99999);
  return `${first.toLowerCase()}.${last.toLowerCase()}${tag}@${pick(EMAIL_DOMAINS)}`;
}

function randomUSPhone() {
  const area = randomIntBetween(200, 999);
  const prefix = randomIntBetween(200, 999);
  const line = randomIntBetween(1000, 9999);
  return `(${area}) ${prefix}-${line}`;
}

// ---------------------------------------------------------------------------
// Main scenario function — called once per VU iteration
// ---------------------------------------------------------------------------
export default function () {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const email = randomEmail(first, last);
  const language = pick(LANGUAGES);
  const source = pick(SOURCES);

  // ~40% of event attendees opt into SMS
  const wantsSMS = Math.random() < 0.4;
  const phone = wantsSMS ? randomUSPhone() : undefined;

  // ── Step 1: Submit signup form (the primary event-day action) ──────────────
  const subscribeBody = JSON.stringify({
    email,
    source,
    signup_phase: 'event_day',
    language,
    ...(wantsSMS ? { phone, sms_consent: true } : {}),
  });

  const t0 = Date.now();
  const subscribeRes = http.post(
    `${BASE_URL}/api/subscribe`,
    subscribeBody,
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'subscribe', sms: wantsSMS ? 'yes' : 'no' },
      timeout: '15s',
    },
  );
  subscribeDuration.add(Date.now() - t0);

  const subscribeOk = check(subscribeRes, {
    'subscribe → 200 OK': (r) => r.status === 200,
    'subscribe → body has message': (r) => {
      try {
        return JSON.parse(r.body).message !== undefined;
      } catch {
        return false;
      }
    },
  });

  subscribeErrorRate.add(!subscribeOk);
  if (subscribeOk) successfulSignups.add(1);

  // Simulate the attendee exploring the page / trying the product (dwell time)
  sleep(randomIntBetween(3, 12));

  // ── Step 2: 25% of signups return to the site later the same day ──────────
  if (Math.random() < 0.25) {
    const touchpointBody = JSON.stringify({
      email,
      source,
      signup_phase: 'event_day',
      language,
      engagement_level: 'high',
    });

    const touchpointRes = http.post(
      `${BASE_URL}/api/touchpoint`,
      touchpointBody,
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { endpoint: 'touchpoint' },
        timeout: '10s',
      },
    );

    const touchpointOk = check(touchpointRes, {
      'touchpoint → 200 OK': (r) => r.status === 200,
    });

    touchpointErrorRate.add(!touchpointOk);

    sleep(randomIntBetween(1, 4));
  }

  // ── Step 3: Small fraction also toggle locale (mimics the language banner) ─
  if (Math.random() < 0.15) {
    const localeBody = JSON.stringify({ locale: language });
    http.post(`${BASE_URL}/api/locale`, localeBody, {
      headers: { 'Content-Type': 'application/json' },
      tags: { endpoint: 'locale' },
    });
    // No explicit check — locale is fire-and-forget from the client
  }
}

// ---------------------------------------------------------------------------
// Teardown: print a human-readable summary to stderr
// ---------------------------------------------------------------------------
export function handleSummary(data) {
  const signups = data.metrics.successful_signups?.values?.count ?? 0;
  const subErrors = (data.metrics.subscribe_error_rate?.values?.rate ?? 0) * 100;
  const p95 = data.metrics.subscribe_duration_ms?.values?.['p(95)'] ?? 0;
  const p99 = data.metrics.subscribe_duration_ms?.values?.['p(99)'] ?? 0;

  const lines = [
    '',
    '═══════════════════════════════════════════════════',
    '  EVENT DAY LOAD TEST — SUMMARY',
    '═══════════════════════════════════════════════════',
    `  Successful signups  : ${signups}`,
    `  Subscribe error rate: ${subErrors.toFixed(2)}%`,
    `  Subscribe p95 latency: ${p95.toFixed(0)} ms`,
    `  Subscribe p99 latency: ${p99.toFixed(0)} ms`,
    '',
    '  Remember: each /api/subscribe fans out to 3 Klaviyo',
    '  API calls. High p99 latency usually means Klaviyo is',
    '  throttling — add retries or batch the upserts.',
    '═══════════════════════════════════════════════════',
    '',
  ];

  return {
    stdout: lines.join('\n'),
  };
}
