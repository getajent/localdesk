import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground selection:bg-danish-red/20`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
