import excludedData from '@/data/founders-excluded-emails.json';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Owner / internal emails that should not count toward Founders 240. */
export function getExcludedFounderEmails(): Set<string> {
  const excluded = new Set<string>();

  for (const raw of excludedData.emails ?? []) {
    if (typeof raw !== 'string') continue;
    const email = normalizeEmail(raw);
    if (email) excluded.add(email);
  }

  const fromEnv = process.env.FOUNDERS_EXCLUDED_EMAILS?.trim();
  if (fromEnv) {
    for (const part of fromEnv.split(',')) {
      const email = normalizeEmail(part);
      if (email) excluded.add(email);
    }
  }

  return excluded;
}

/** Full names on billing/shipping (e.g. when checkout has no email). Exact match only. */
export function getExcludedFounderNames(): Set<string> {
  const excluded = new Set<string>();

  for (const raw of excludedData.names ?? []) {
    if (typeof raw !== 'string') continue;
    const name = normalizeName(raw);
    if (name) excluded.add(name);
  }

  const fromEnv = process.env.FOUNDERS_EXCLUDED_NAMES?.trim();
  if (fromEnv) {
    for (const part of fromEnv.split(',')) {
      const name = normalizeName(part);
      if (name) excluded.add(name);
    }
  }

  return excluded;
}

export function isExcludedFounderEmail(
  email: string | null | undefined,
  excluded: Set<string>,
): boolean {
  if (!email || excluded.size === 0) return false;
  return excluded.has(normalizeEmail(email));
}

function orderNameMatchesExcluded(
  name: string | null | undefined,
  excludedNames: Set<string>,
): boolean {
  if (!name || excludedNames.size === 0) return false;
  return excludedNames.has(normalizeName(name));
}

export function isExcludedFounderOrder(
  order: {
    email?: string | null;
    billingAddress?: { name?: string | null } | null;
    shippingAddress?: { name?: string | null } | null;
  },
  excludedEmails: Set<string>,
  excludedNames: Set<string>,
): boolean {
  if (isExcludedFounderEmail(order.email, excludedEmails)) return true;

  return (
    orderNameMatchesExcluded(order.billingAddress?.name, excludedNames) ||
    orderNameMatchesExcluded(order.shippingAddress?.name, excludedNames)
  );
}
