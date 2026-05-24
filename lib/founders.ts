/**
 * Founders 240 count — unique Shopify customers with a "Pre-Order" tagged order.
 * Falls back to `data/founders.json` if Shopify env vars are missing or the API fails.
 */
import { unstable_cache } from 'next/cache';
import foundersData from '@/data/founders.json';
import { fetchFoundersCustomerCountFromShopify } from '@/lib/shopify/admin';

export const FOUNDERS_TOTAL = 240;

export const FOUNDERS_SHOPIFY_URL =
  'https://www.sisepuedeshop.com/products/founders-240';

export const FOUNDERS_GROUP_CHAT_URL =
  'https://ig.me/j/AbbRc1hRH_cRwq-N/';

const CACHE_SECONDS = 60;

function clampFounderCount(count: number): number {
  return Math.min(Math.max(0, Math.floor(count)), FOUNDERS_TOTAL);
}

function getFallbackFounderCount(): number {
  const raw = foundersData.count;
  if (typeof raw !== 'number' || Number.isNaN(raw)) return 0;
  return clampFounderCount(raw);
}

const getCachedShopifyFounderCount = unstable_cache(
  async () => fetchFoundersCustomerCountFromShopify(),
  ['founders-shopify-unique-customers'],
  { revalidate: CACHE_SECONDS, tags: ['founders-count'] },
);

export async function getFounderCount(): Promise<number> {
  try {
    const shopifyCount = await getCachedShopifyFounderCount();
    if (shopifyCount !== null) {
      return clampFounderCount(shopifyCount);
    }
  } catch (err) {
    console.error('[founders] Shopify count error:', err);
  }
  return getFallbackFounderCount();
}

export function getFoundersRemaining(count: number): number {
  return FOUNDERS_TOTAL - count;
}

export function getFoundersPercent(count: number): number {
  return (count / FOUNDERS_TOTAL) * 100;
}

/** Format founder number as #001 … #240 */
export function formatFounderNumber(n: number): string {
  return `#${String(n).padStart(3, '0')}`;
}

export function isFoundersSoldOut(count: number): boolean {
  return count >= FOUNDERS_TOTAL;
}
