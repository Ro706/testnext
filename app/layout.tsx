import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🔤 Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🧾 Metadata
export const metadata: Metadata = {
  title: {
    default: "Next Auth App",
    template: "%s | Next Auth App",
  },
  description: "Modern authentication app built with Next.js",
};

// 🏗️ Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="dark" // 🌙 Enable dark mode
      suppressHydrationWarning
    >
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen
          bg-background
          text-foreground
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
