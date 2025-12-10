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
  title: "InkSesh - Tattoo Portfolio & Design Gallery",
  description: "Discover and showcase your tattoo designs. Build your personal tattoo portfolio with AI-powered analysis, Instagram integration, and beautiful design galleries.",
  keywords: ["tattoo", "portfolio", "design", "gallery", "artist"],
  authors: [{ name: "InkSesh" }],
  openGraph: {
    title: "InkSesh - Tattoo Portfolio & Design Gallery",
    description: "Showcase your tattoo designs with AI-powered analysis and portfolio management.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
