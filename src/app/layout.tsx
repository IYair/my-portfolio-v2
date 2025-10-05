import Navigation from "@/components/layout/Navigation";
import SessionProvider from "@/components/providers/SessionProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yair Chan - Portfolio",
  description: "Portfolio personal de Yair Chan - Desarrollador Full Stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Blocking script to prevent theme flash - minified for performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{let e=localStorage.getItem('theme');('dark'===e||!e&&matchMedia('(prefers-color-scheme:dark)').matches)&&document.documentElement.classList.add('dark')}catch(e){}}();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Navigation />
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster position="top-right" expand={false} richColors closeButton theme="system" />
        </SessionProvider>
      </body>
    </html>
  );
}
