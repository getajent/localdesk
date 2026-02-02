import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
