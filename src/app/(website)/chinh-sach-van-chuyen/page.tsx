import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/website/common";
import {
  siteUrlAlt,
  storeAddress,
  contactHotlineDisplay,
  contactHotlineTel,
} from "@/config/site";

const altBase = siteUrlAlt.replace(/\/$/, "");
const canonicalUrl = `${altBase}/chinh-sach-van-chuyen`;

const PAGE_TITLE = "Chính sách vận chuyển – Ắc Quy HN";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | Ắc Quy HN`,
  description:
    "Chính sách vận chuyển Ắc Quy HN: giao tận nơi, thời gian 15–30 phút nội thành, phí ship, kiểm tra hàng và trách nhiệm giao hàng tại TP.HCM.",
  keywords: [
    "chính sách vận chuyển",
    "giao ắc quy tận nơi",
    "ship ắc quy TP.HCM",
    "Ắc Quy HN",
    "giao hàng 24/7",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Giao & lắp tận nơi, miễn phí khu vực gần cửa hàng, hỗ trợ 24/7 — Ắc Quy HN.",
    url: canonicalUrl,
    siteName: "Ắc Quy HN",
    locale: "vi_VN",
  },
  robots: { index: true, follow: true },
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-4 pb-0">
        <Breadcrumbs items={[]} currentPage="Chính sách vận chuyển" />
      </div>

      <article className="pb-10 md:pb-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4 md:p-6">
            <header className="mb-10 md:mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                CHÍNH SÁCH VẬN CHUYỂN – ẮC QUY HN
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Quy định giao nhận khi mua sản phẩm hoặc sử dụng dịch vụ.
              </p>
            </header>

            <div className="prose prose-gray max-w-none space-y-10 text-gray-700">
              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  1. Phạm vi áp dụng
                </h2>
                <p className="mt-3 leading-relaxed">
                  Chính sách vận chuyển áp dụng cho tất cả khách hàng mua sản
                  phẩm hoặc sử dụng dịch vụ tại Ắc Quy HN trong khu vực TP. Hồ
                  Chí Minh và các khu vực lân cận.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  2. Hình thức giao hàng
                </h2>
                <div className="not-prose mt-4 space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Giao hàng tận nơi
                    </p>
                    <p className="mt-2 leading-relaxed text-gray-700">
                      Nhân viên giao và lắp đặt trực tiếp tại địa chỉ khách
                      hàng.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Nhận hàng tại cửa hàng
                    </p>
                    <p className="mt-2 leading-relaxed text-gray-700">
                      Khách hàng có thể đến trực tiếp để mua và lắp đặt.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  3. Thời gian giao hàng
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Nội thành: từ 15 – 30 phút kể từ khi xác nhận đơn</li>
                  <li>Khu vực xa hơn: từ 30 – 60 phút hoặc theo thỏa thuận</li>
                  <li>Hoạt động 24/7, kể cả ngày lễ, Tết</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  4. Phí vận chuyển
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Miễn phí giao hàng trong khu vực gần cửa hàng</li>
                  <li>Khu vực xa có thể phát sinh phí (sẽ được báo trước)</li>
                  <li>Cam kết không phát sinh chi phí ngoài thỏa thuận</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  5. Kiểm tra khi nhận hàng
                </h2>
                <p className="mt-3 leading-relaxed">Khách hàng vui lòng:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Kiểm tra đúng loại ắc quy đã đặt</li>
                  <li>
                    Kiểm tra tình trạng sản phẩm (mới, không trầy xước, không hư
                    hỏng)
                  </li>
                  <li>Xác nhận trước khi thanh toán</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  6. Trách nhiệm giao hàng
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Đảm bảo giao đúng sản phẩm, đúng thời gian đã cam kết</li>
                  <li>Hỗ trợ lắp đặt và kiểm tra điện miễn phí</li>
                  <li>Hướng dẫn sử dụng sau khi lắp đặt</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  7. Trường hợp chậm trễ
                </h2>
                <p className="mt-3 leading-relaxed">
                  Trong một số trường hợp khách quan như:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Thời tiết xấu</li>
                  <li>Kẹt xe, sự cố giao thông</li>
                  <li>Quá tải đơn hàng</li>
                </ul>
                <p className="mt-4 leading-relaxed">
                  Chúng tôi sẽ chủ động liên hệ thông báo và hỗ trợ sớm nhất cho
                  khách hàng.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  8. Thông tin liên hệ
                </h2>
                <p className="mt-3 leading-relaxed">
                  Mọi thắc mắc về vận chuyển, vui lòng liên hệ:
                </p>
                <div className="not-prose mt-4 rounded-lg border border-gray-200 bg-gray-50 p-5 text-gray-800">
                  <p className="font-semibold text-gray-900">Ắc Quy HN</p>
                  <p className="mt-2">
                    Hotline:{" "}
                    <a
                      href={`tel:${contactHotlineTel}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {contactHotlineDisplay}
                    </a>
                  </p>
                  <p className="mt-2">Địa chỉ: {storeAddress}</p>
                  <p className="mt-4 text-sm">
                    <Link
                      href="/contact"
                      className="text-primary hover:underline"
                    >
                      → Trang liên hệ
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
