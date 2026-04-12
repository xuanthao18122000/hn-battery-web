import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/website/common";
import {
  siteUrl,
  siteUrlAlt,
  contactPhone,
  contactHotlineDisplay,
  contactHotlineTel,
  contactEmail,
  storeAddress,
} from "@/config/site";

const baseUrl = siteUrl.replace(/\/$/, "");
const altBase = siteUrlAlt.replace(/\/$/, "");
const canonicalUrl = `${altBase}/about`;

const PAGE_DESCRIPTION =
  "Ắc Quy HN – ắc quy chính hãng xe máy, ô tô, thiết bị điện dân dụng; thay tận nơi 15–30 phút, cứu hộ 24/7 tại TP.HCM. GS, Rocket, Yamato – cam kết chính hãng, minh bạch.";

const SEO_KEYWORDS = [
  "giới thiệu Ắc Quy HN",
  "ắc quy chính hãng",
  "ắc quy TP.HCM",
  "ắc quy xe máy",
  "ắc quy ô tô",
  "thay ắc quy tận nơi",
  "cứu hộ ắc quy 24/7",
  "ắc quy GS",
  "ắc quy Rocket",
  "ắc quy Yamato",
  "Ắc Quy HN",
  "Ắc Quy SG",
  "Ắc Quy Sài Gòn",
  "Ắc Quy HN Sài Gòn",
  "acquyhn",
  "acquyhnsaigon",
  "bảo hành ắc quy",
] as const;

export const metadata: Metadata = {
  title: "Giới thiệu Ắc Quy HN | Ắc quy chính hãng & cứu hộ 24/7 TP.HCM",
  description: PAGE_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: "Giới thiệu Ắc Quy HN | Ắc quy chính hãng TP.HCM",
    description: PAGE_DESCRIPTION,
    url: canonicalUrl,
    siteName: "Ắc Quy HN",
    images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: "Ắc Quy HN" }],
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu Ắc Quy HN",
    description: PAGE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Giới thiệu Ắc Quy HN",
  description: PAGE_DESCRIPTION,
  url: canonicalUrl,
  inLanguage: "vi-VN",
  mainEntity: {
    "@type": "Organization",
    name: "Ắc Quy HN",
    alternateName: ["Ắc Quy HN", "Ắc Quy HN Sài Gòn"],
    url: baseUrl,
    telephone: contactPhone,
    email: contactEmail,
    address: { "@type": "PostalAddress", streetAddress: storeAddress, addressCountry: "VN" },
  },
};

const SERVICES = [
  "Cung cấp ắc quy chính hãng cho xe máy, ô tô, xe tải",
  "Thay ắc quy tận nơi nhanh chóng (15–30 phút)",
  "Dịch vụ cứu hộ ắc quy 24/7",
  "Kiểm tra, tư vấn hệ thống điện miễn phí",
  "Thu mua và đổi ắc quy cũ giá tốt",
] as const;

const COMMITMENTS = [
  "Sản phẩm chính hãng 100%, nguồn gốc rõ ràng",
  "Giá cả cạnh tranh, minh bạch",
  "Bảo hành đầy đủ theo tiêu chuẩn nhà sản xuất",
  "Phục vụ nhanh chóng, chuyên nghiệp, đúng hẹn",
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-5xl px-4 pt-4">
        <Breadcrumbs items={[]} currentPage="Giới thiệu" />
      </div>

      <section className="pt-12 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Giới thiệu về Ắc Quy HN
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ắc quy chính hãng · Xe máy &amp; ô tô · Thay tận nơi · Cứu hộ 24/7 · TP. Hồ Chí Minh
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12 not-prose space-y-4 text-gray-700 leading-relaxed">
              <p>
                Ắc Quy HN là đơn vị chuyên cung cấp và phân phối các dòng ắc quy chính hãng dành
                cho xe máy, ô tô và các thiết bị điện dân dụng. Với định hướng phát triển bền vững
                và lấy uy tín làm nền tảng, chúng tôi luôn cam kết mang đến cho khách hàng những sản
                phẩm chất lượng cao cùng dịch vụ tận tâm, nhanh chóng.
              </p>
              <p>
                Ngay từ những ngày đầu hoạt động, Ắc Quy HN đã không ngừng nỗ lực để trở thành địa
                chỉ tin cậy trong lĩnh vực cung cấp và thay thế ắc quy tại khu vực TP. Hồ Chí Minh.
                Chúng tôi cung cấp đa dạng các thương hiệu ắc quy uy tín như GS, Rocket, Yamato… đáp
                ứng đầy đủ nhu cầu sử dụng từ phổ thông đến cao cấp.
              </p>
            </div>

            <div className="mb-12 not-prose">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Tầm nhìn – Sứ mệnh</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <span className="font-semibold text-gray-900">Tầm nhìn:</span> Trở thành đơn vị
                  cung cấp ắc quy và dịch vụ cứu hộ hàng đầu, được khách hàng tin tưởng lựa chọn lâu
                  dài.
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Sứ mệnh:</span> Mang đến giải pháp
                  năng lượng ổn định, an toàn và tiện lợi cho mọi khách hàng.
                </p>
              </div>
            </div>

            <div className="mb-12 not-prose">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dịch vụ tại Ắc Quy HN</h2>
              <ul className="list-none space-y-3 p-0 m-0 text-gray-700 leading-relaxed">
                {SERVICES.map((line) => (
                  <li key={line} className="flex gap-3 items-start">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12 not-prose">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cam kết của chúng tôi</h2>
              <ul className="list-none space-y-3 p-0 m-0 text-gray-700 leading-relaxed">
                {COMMITMENTS.map((line) => (
                  <li key={line} className="flex gap-3 items-start">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12 not-prose">
              <p className="text-gray-700 leading-relaxed text-lg">
                Với đội ngũ kỹ thuật giàu kinh nghiệm và phong cách phục vụ tận tâm, Ắc Quy HN luôn
                sẵn sàng đồng hành cùng bạn trên mọi hành trình.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg not-prose">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h2>
              <div className="space-y-3 text-gray-700">
                <p className="font-semibold text-gray-900">Ắc Quy HN</p>
                <p>Địa chỉ: {storeAddress}</p>
                <p>
                  Hotline:{" "}
                  <a href={`tel:${contactHotlineTel}`} className="text-primary hover:underline">
                    {contactHotlineDisplay}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                    {contactEmail}
                  </a>
                </p>
                <p>Thời gian hỗ trợ: 24/7 (cứu hộ / hotline)</p>
                <p className="text-sm text-gray-500 pt-2">
                  Website:{" "}
                  <a
                    href={baseUrl}
                    className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    {baseUrl}
                  </a>
                  {altBase !== baseUrl && (
                    <>
                      {" · "}
                      <a
                        href={altBase}
                        className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        {altBase}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
