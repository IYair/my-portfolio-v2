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
