import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import Script from 'next/script';
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getTextDirection } from '@/i18n/locales';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LocalDesk - Navigate Danish Bureaucracy with Confidence",
  description: "Get instant answers about SKAT, visas, and housing from your AI-powered Danish consultant",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params in Next.js 15+
  const { locale } = await params;

  // Validate locale parameter
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the locale
  const messages = await getMessages();

  // Get text direction for the locale (ltr or rtl)
  const dir = getTextDirection(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Get saved consent or default to denied
            const savedConsent = localStorage.getItem('cookie-consent');
            
            gtag('consent', 'default', {
              'ad_storage': savedConsent === 'accepted' ? 'granted' : 'denied',
              'ad_user_data': savedConsent === 'accepted' ? 'granted' : 'denied',
              'ad_personalization': savedConsent === 'accepted' ? 'granted' : 'denied',
              'analytics_storage': savedConsent === 'accepted' ? 'granted' : 'denied'
            });
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17724668039"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', 'AW-17724668039');
          `}
        </Script>
      </head>
      <body className={`${manrope.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground selection:bg-danish-red/20`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || ((!localStorage.getItem('theme') || localStorage.getItem('theme') === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
            <CookieConsent />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
