import type { Metadata } from "next";
import { siteUrlAlt } from "@/config/site";

export const metadata: Metadata = {
  title: "Liên hệ - Công Ty TNHH Ắc Quy",
  description: "Liên hệ Công Ty TNHH Ắc Quy - Địa chỉ cửa hàng, hotline, form gửi tin nhắn. Hỗ trợ tư vấn ắc quy 24/7.",
  keywords: "liên hệ ắc quy, cửa hàng ắc quy, hotline ắc quy",
  alternates: { canonical: `${siteUrlAlt}/contact` },
  openGraph: {
    title: "Liên hệ - Công Ty TNHH Ắc Quy",
    description: "Liên hệ Công Ty TNHH Ắc Quy - Địa chỉ, hotline, form gửi tin nhắn",
    url: `${siteUrlAlt}/contact`,
    images: ["/og-image.jpg"],
  },
};

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
