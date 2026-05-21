// Server-only — imports pg driver. Do NOT import this in client components.
export type { SiteSettings } from './settings-shared';
export { SETTING_DEFAULTS } from './settings-shared';

import type { SiteSettings } from './settings-shared';
import { SETTING_DEFAULTS } from './settings-shared';

const pool = require('@/database/connection');

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await pool.query('SELECT key, value FROM site_settings');
    const merged: SiteSettings = { ...SETTING_DEFAULTS };
    for (const row of result.rows) {
      if (row.value !== null && row.value !== undefined) {
        merged[row.key] = row.value as string;
      }
    }
    return merged;
  } catch {
    return SETTING_DEFAULTS;
  }
}

export function darkenHex(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const r = Math.max(0, parseInt(clean.slice(0, 2), 16) - 30);
  const g = Math.max(0, parseInt(clean.slice(2, 4), 16) - 30);
  const b = Math.max(0, parseInt(clean.slice(4, 6), 16) - 30);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function formatPrice(amount: number | string, settings: Pick<SiteSettings, 'currency_symbol' | 'currency_position'>): string {
  const symbol = settings.currency_symbol || '$';
  const position = settings.currency_position || 'before';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = isNaN(num) ? '0.00' : num.toFixed(2);
  return position === 'after' ? `${formatted}${symbol}` : `${symbol}${formatted}`;
}
