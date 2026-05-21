'use client';

import { createContext, useContext } from 'react';
import type { SiteSettings } from './settings-shared';
import { SETTING_DEFAULTS } from './settings-shared';

const SettingsContext = createContext<SiteSettings>(SETTING_DEFAULTS);

export function SettingsProvider({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SiteSettings {
  return useContext(SettingsContext);
}

export function useFormatPrice() {
  const settings = useSettings();
  return (amount: number | string) => {
    const symbol = settings.currency_symbol || '$';
    const position = settings.currency_position || 'before';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    const formatted = isNaN(num) ? '0.00' : num.toFixed(2);
    return position === 'after' ? `${formatted}${symbol}` : `${symbol}${formatted}`;
  };
}
