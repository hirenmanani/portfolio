import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First Last — Software Engineer | Systems • ML • Backend",
  description:
    "MS CS candidate building high-performance systems and ML-driven products. Focused on measurable impact, reliability, and clean engineering.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "First Last — Portfolio",
    description:
      "Software Engineer | Systems • ML • Backend — projects, experience, and impact.",
    url: "https://example.com",
    siteName: "First Last",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Portfolio OG" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First Last — Portfolio",
    description:
      "MS CS candidate building high-performance systems and ML-driven products.",
    images: ["/og.png"],
  },
  alternates: { canonical: "https://example.com" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
