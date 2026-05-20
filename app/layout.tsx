import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "RS Artelier | Art, Colors, and Creativity",
    template: "%s | RS Artelier",
  },
  description:
    "Welcome to RS Artelier. A small collection of watercolors, acrylics, oil paintings, and pencil sketches by Rajvi.",
  openGraph: {
    title: "RS Artelier | Art Portfolio",
    description:
      "A small collection of watercolors, acrylics, oil paintings, and pencil sketches by Rajvi.",
    siteName: "RS Artelier",
    images: [
      {
        url: "/images/rs-logo.png",
        width: 1200,
        height: 630,
        alt: "RS Artelier - Art Portfolio by Rajvi",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RS Artelier | Art Portfolio",
    description:
      "A small collection of watercolors, acrylics, oil paintings, and pencil sketches by Rajvi.",
    images: ["/images/rs-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body" suppressHydrationWarning>{children}</body>
    </html>
  );
}
