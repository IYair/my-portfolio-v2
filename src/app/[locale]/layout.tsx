import Navigation from "@/components/layout/Navigation";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { MotionProvider } from "@/components/providers/MotionProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import { routing } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Yair Chan - Portfolio",
  description: "Portfolio personal de Yair Chan - Desarrollador Full Stack",
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as never)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SessionProvider>
        <MotionProvider>
          <ScrollToTop />
          <Navigation />
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster position="top-right" expand={false} richColors closeButton theme="system" />
        </MotionProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
