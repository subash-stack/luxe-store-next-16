import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

// UI and body copy: neutral grotesk, tracked uppercase for labels.
const sans = Geist({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

// Editorial headlines only (type-display / type-headline).
const display = Cormorant_Garamond({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Luxe Store",
    template: "%s | Luxe Store",
  },
  description: "Luxury fashion and accessories.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
