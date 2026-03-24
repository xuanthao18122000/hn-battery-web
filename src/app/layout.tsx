import type { Metadata } from "next";
import { siteUrl, siteLogoPath, siteLogoUrl, contactPhone, socialLinks, storeAddress } from "@/config/site";
import "./globals.css";

/* globals.css dùng stack system — bỏ next/font Roboto (5 weight) để giảm bytes + request không dùng. */

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ắc Quy HN Sài Gòn | Ắc quy ô tô - xe máy chính hãng",
    template: "%s | Ắc Quy HN Sài Gòn",
  },
  description:
    "Ắc Quy HN Sài Gòn - Chuyên ắc quy ô tô, ắc quy xe máy chính hãng. ✓ Chất lượng ✓ Giá tốt ✓ Bảo hành. Liên hệ ngay để được tư vấn!",
  keywords: [
    "ắc quy",
    "ắc quy ô tô",
    "ắc quy xe máy",
    "pin ắc quy",
    "Ắc Quy HN",
    "Ắc Quy HN Sài Gòn",
    "acquyhn",
    "acquyhnsaigon",
    "Ắc Quy",
    "ắc quy chính hãng",
    "TP.HCM",
    "Sài Gòn",
  ],
  authors: [{ name: "Ắc Quy HN Sài Gòn" }],
  creator: "Ắc Quy HN Sài Gòn",
  publisher: "Ắc Quy HN Sài Gòn",
  icons: {
    icon: siteLogoPath,
    shortcut: siteLogoPath,
    apple: siteLogoPath,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "Ắc Quy HN Sài Gòn",
    title: "Ắc Quy HN Sài Gòn | Ắc quy ô tô - xe máy chính hãng",
    description:
      "Ắc Quy HN Sài Gòn - Ắc quy ô tô, xe máy chính hãng. Chất lượng, giá tốt, bảo hành.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ắc Quy HN Sài Gòn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ắc Quy HN Sài Gòn | Ắc quy ô tô - xe máy chính hãng",
    description: "Ắc Quy HN Sài Gòn - Ắc quy ô tô, xe máy chính hãng.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: 'google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ắc Quy HN Sài Gòn",
    "url": siteUrl,
    "logo": siteLogoUrl,
    "description":
      "Ắc Quy HN Sài Gòn - Chuyên ắc quy ô tô, ắc quy xe máy chính hãng. Chất lượng, giá tốt, bảo hành.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": storeAddress,
      "addressCountry": "VN",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contactPhone,
      "contactType": "customer service",
      "areaServed": "VN",
      "availableLanguage": ["vi"],
    },
    "sameAs": [socialLinks.facebook, socialLinks.linkedin],
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
