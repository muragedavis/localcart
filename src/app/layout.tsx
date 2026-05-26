import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import '@/styles/globals.css';
import { getSiteSettings, darkenHex } from '@/lib/settings';
import { SettingsProvider } from '@/lib/settings-context';
import { ThemeProvider } from '@/lib/theme-context';

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: settings.site_name,
    description: settings.site_tagline,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const cssVars = `
    :root {
      --color-primary: ${settings.primary_color};
      --color-primary-dark: ${darkenHex(settings.primary_color)};
      --color-secondary: ${settings.secondary_color};
      --color-secondary-dark: ${darkenHex(settings.secondary_color)};
      --color-accent: ${settings.accent_color};
      --color-hero-bg: ${settings.hero_bg_color || '#0a0a0a'};
      --color-header-bg: ${settings.header_bg_color || '#ffffff'};
      --color-header-text: ${settings.header_text_color || '#111111'};
    }
  `;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        {settings.favicon_url && <link rel="icon" href={settings.favicon_url} />}
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <SettingsProvider settings={settings}>
            <Header settings={settings} />
            <main className="flex-grow">{children}</main>
            <Footer settings={settings} />
            <WhatsAppWidget />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
