import type { Metadata } from "next";
import { siteUrlAlt } from "@/config/site";

export const metadata: Metadata = {
  title: "Liên hệ - Ắc Quy HN",
  description: "Liên hệ Ắc Quy HN - Địa chỉ cửa hàng, hotline, form gửi tin nhắn. Hỗ trợ tư vấn ắc quy 24/7.",
  keywords: "liên hệ Ắc Quy HN, cửa hàng ắc quy, hotline ắc quy, acquyhn, Ắc Quy HN Sài Gòn",
  alternates: { canonical: `${siteUrlAlt}/contact` },
  openGraph: {
    title: "Liên hệ - Ắc Quy HN",
    description: "Liên hệ Ắc Quy HN - Địa chỉ, hotline, form gửi tin nhắn",
    url: `${siteUrlAlt}/contact`,
    images: ["/og-image.jpg"],
  },
};

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
