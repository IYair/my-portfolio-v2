import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yairchancusco.me"),
  title: {
    default: "Yair Chan – Full Stack Developer",
    template: "%s | Yair Chan",
  },
  description:
    "Portfolio de Yair Chan – Desarrollador Full Stack especializado en React, Next.js, Node.js y TypeScript.",
  keywords: [
    "Yair Chan",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "portfolio",
    "desarrollador web",
  ],
  authors: [{ name: "Yair Chan", url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: "Yair Chan",
  openGraph: {
    type: "website",
    locale: "es_MX",
    alternateLocale: "en_US",
    siteName: "Yair Chan – Portfolio",
    title: "Yair Chan – Full Stack Developer",
    description:
      "Portfolio de Yair Chan – Desarrollador Full Stack especializado en React, Next.js, Node.js y TypeScript.",
    images: [{ url: "/images/me.png", width: 440, height: 660, alt: "Yair Chan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yair Chan – Full Stack Developer",
    description:
      "Portfolio de Yair Chan – Desarrollador Full Stack especializado en React, Next.js, Node.js y TypeScript.",
    creator: "@EnyaDev",
    images: ["/images/me.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Blocking script to prevent theme flash - minified for performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{let e=localStorage.getItem('theme');('dark'===e||!e&&matchMedia('(prefers-color-scheme:dark)').matches)&&document.documentElement.classList.add('dark')}catch(e){}}();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
