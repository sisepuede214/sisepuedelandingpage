/**
 * One-off: verify founders pre-order count against Shopify Admin API.
 * Usage: node scripts/test-shopify-founders.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const excludedJson = JSON.parse(
  readFileSync(resolve(__dirname, '../data/founders-excluded-emails.json'), 'utf8'),
);
const envPath = resolve(__dirname, '../.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);

const domain = env.SHOPIFY_STORE_DOMAIN?.trim()
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');
const token = env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();

if (!domain || !token) {
  console.error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env');
  process.exit(1);
}

const API = `https://${domain}/admin/api/2024-10/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error('HTTP', res.status, json);
    process.exit(1);
  }
  if (json.errors?.length) {
    const msg = json.errors.map((e) => e.message).join('; ');
    const err = new Error(msg);
    err.graphqlErrors = json.errors;
    throw err;
  }
  return json.data;
}

const normalizeName = (n) => n.trim().toLowerCase().replace(/\s+/g, ' ');

const excludedEmails = new Set(
  [
    ...(excludedJson.emails ?? []),
    ...(env.FOUNDERS_EXCLUDED_EMAILS?.split(',') ?? []),
  ]
    .map((e) => e?.trim().toLowerCase())
    .filter(Boolean),
);
const excludedNames = new Set(
  [
    ...(excludedJson.names ?? []),
    ...(env.FOUNDERS_EXCLUDED_NAMES?.split(',') ?? []),
  ]
    .map((n) => normalizeName(n))
    .filter(Boolean),
);

function isExcluded(order) {
  const email = order.email?.trim().toLowerCase();
  if (email && excludedEmails.has(email)) return true;
  const billing = order.billingAddress?.name;
  const shipping = order.shippingAddress?.name;
  if (billing && excludedNames.has(normalizeName(billing))) return true;
  if (shipping && excludedNames.has(normalizeName(shipping))) return true;
  return false;
}

function founderKey(order) {
  if (isExcluded(order)) return null;
  const email = order.email?.trim().toLowerCase();
  if (!email) return null;
  return `email:${email}`;
}

async function countOrders(searchQuery) {
  const unique = new Set();
  let cursor = null;
  let orderCount = 0;

  while (true) {
    const data = await gql(
      `query FoundersTest($query: String!, $first: Int!, $after: String) {
        orders(first: $first, after: $after, query: $query, sortKey: CREATED_AT) {
          edges {
            node {
              name
              email
              tags
              billingAddress { name }
              shippingAddress { name }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }`,
      { query: searchQuery, first: 100, after: cursor },
    );

    for (const { node } of data.orders.edges) {
      orderCount++;
      const key = founderKey(node);
      if (key) unique.add(key);
    }

    if (!data.orders.pageInfo.hasNextPage) break;
    cursor = data.orders.pageInfo.endCursor;
    if (!cursor) break;
  }

  return { orderCount, uniqueCount: unique.size };
}

console.log('Store:', domain);

const shopData = await gql('{ shop { name myshopifyDomain } }');
console.log('Shop:', shopData.shop.name, `(${shopData.shop.myshopifyDomain})`);
console.log('Excluded emails:', excludedEmails.size ? [...excludedEmails].join(', ') : '(none)');
console.log('Excluded names:', excludedNames.size ? [...excludedNames].join(', ') : '(none)');
console.log('');

try {
  const tagResult = await countOrders('tag:"Pre-Order" NOT status:cancelled');
  console.log('=== tag:"Pre-Order" NOT status:cancelled (current app logic) ===');
  console.log('Orders:', tagResult.orderCount);
  console.log('Unique founders:', tagResult.uniqueCount);
} catch (err) {
  console.log('=== Orders query FAILED ===');
  console.log(err.message);
  if (err.message.includes('orders field')) {
    console.log('\nFix: Shopify Admin → Settings → Apps → your custom app');
    console.log('  → Configure Admin API scopes → enable read_orders');
    console.log('  → Install / regenerate token → update SHOPIFY_ADMIN_ACCESS_TOKEN in .env');
  }
}

