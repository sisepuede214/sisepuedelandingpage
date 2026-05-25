import {
  getExcludedFounderEmails,
  getExcludedFounderNames,
  isExcludedFounderOrder,
} from '@/lib/founders-excluded';

const SHOPIFY_API_VERSION = '2024-10';
const ORDERS_PAGE_SIZE = 100;

/** Orders with this tag count toward Founders 240 (one spot per unique customer). */
export const FOUNDERS_SHOPIFY_ORDER_TAG = 'Pre-Order';

const ORDER_SEARCH_QUERY = `tag:"${FOUNDERS_SHOPIFY_ORDER_TAG}" NOT status:cancelled`;

type GraphQLError = { message: string };

type OrdersPageResponse = {
  data?: {
    orders?: {
      edges?: Array<{
        node?: {
          email?: string | null;
          billingAddress?: { name?: string | null } | null;
          shippingAddress?: { name?: string | null } | null;
        };
      }>;
      pageInfo?: {
        hasNextPage?: boolean;
        endCursor?: string | null;
      };
    };
  };
  errors?: GraphQLError[];
};

function getShopifyConfig(): { domain: string; token: string } | null {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  if (!rawDomain || !token) return null;

  const domain = rawDomain
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  return { domain, token };
}

function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return normalized || null;
}

/** Stable key from order email (works with read_orders only; no read_customers needed). */
function founderIdentityKey(order: { email?: string | null }): string | null {
  const email = normalizeEmail(order.email);
  if (email) return `email:${email}`;
  return null;
}

async function shopifyGraphql<T>(
  config: { domain: string; token: string },
  query: string,
  variables: Record<string, unknown>,
): Promise<T | null> {
  const res = await fetch(
    `https://${config.domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': config.token,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    console.error('[shopify] GraphQL HTTP', res.status, await res.text().catch(() => ''));
    return null;
  }

  const json = (await res.json()) as T & { errors?: GraphQLError[] };

  if (json.errors?.length) {
    console.error('[shopify] GraphQL', json.errors.map((e) => e.message).join('; '));
    return null;
  }

  return json;
}

const ORDERS_PAGE_QUERY = `query FoundersOrdersPage($query: String!, $first: Int!, $after: String) {
  orders(first: $first, after: $after, query: $query, sortKey: CREATED_AT) {
    edges {
      node {
        email
        billingAddress {
          name
        }
        shippingAddress {
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

/**
 * Count unique customers with a non-cancelled pre-order (tag "Pre-Order").
 * One founder spot per customer, even if they placed multiple orders.
 * Returns null when Shopify is not configured or the request fails.
 */
export async function fetchFoundersCustomerCountFromShopify(): Promise<number | null> {
  const config = getShopifyConfig();
  if (!config) return null;

  const excludedEmails = getExcludedFounderEmails();
  const excludedNames = getExcludedFounderNames();
  const uniqueFounders = new Set<string>();
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const json: OrdersPageResponse | null = await shopifyGraphql<OrdersPageResponse>(
      config,
      ORDERS_PAGE_QUERY,
      {
      query: ORDER_SEARCH_QUERY,
      first: ORDERS_PAGE_SIZE,
      after: cursor,
      },
    );

    if (!json?.data?.orders) return null;

    for (const edge of json.data.orders.edges ?? []) {
      const node = edge.node;
      if (!node) continue;
      if (isExcludedFounderOrder(node, excludedEmails, excludedNames)) continue;
      const key = founderIdentityKey(node);
      if (key) uniqueFounders.add(key);
    }

    hasNextPage = json.data.orders.pageInfo?.hasNextPage ?? false;
    cursor = json.data.orders.pageInfo?.endCursor ?? null;

    if (hasNextPage && !cursor) break;
  }

  return uniqueFounders.size;
}
