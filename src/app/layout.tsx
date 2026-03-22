import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { siteUrl, siteLogoPath, siteLogoUrl, contactPhone, socialLinks } from "@/config/site";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["vietnamese", "latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ắc quy Trung Nguyên | Ắc quy ô tô - xe máy chính hãng",
    template: "%s | Ắc quy Trung Nguyên",
  },
  description:
    "Ắc quy Trung Nguyên - Chuyên ắc quy ô tô, ắc quy xe máy chính hãng. ✓ Chất lượng ✓ Giá tốt ✓ Bảo hành. Liên hệ ngay để được tư vấn!",
  keywords: [
    "ắc quy",
    "ắc quy ô tô",
    "ắc quy xe máy",
    "pin ắc quy",
    "Ắc quy Trung Nguyên",
    "acquytrungnguyen",
    "ắc quy chính hãng",
    "TP.HCM",
  ],
  authors: [{ name: "Ắc quy Trung Nguyên" }],
  creator: "Ắc quy Trung Nguyên",
  publisher: "Ắc quy Trung Nguyên",
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
    siteName: "Ắc quy Trung Nguyên",
    title: "Ắc quy Trung Nguyên | Ắc quy ô tô - xe máy chính hãng",
    description:
      "Ắc quy Trung Nguyên - Ắc quy ô tô, xe máy chính hãng. Chất lượng, giá tốt, bảo hành.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ắc quy Trung Nguyên",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ắc quy Trung Nguyên | Ắc quy ô tô - xe máy chính hãng",
    description: "Ắc quy Trung Nguyên - Ắc quy ô tô, xe máy chính hãng.",
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
    "name": "Ắc quy Trung Nguyên",
    "url": siteUrl,
    "logo": siteLogoUrl,
    "description":
      "Ắc quy Trung Nguyên - Chuyên ắc quy ô tô, ắc quy xe máy chính hãng. Chất lượng, giá tốt, bảo hành.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "TP. Hồ Chí Minh",
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
      <body className={`antialiased ${roboto.variable}`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
