import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/website/common";
import {
  siteUrlAlt,
  storeAddress,
  contactHotlineDisplay,
  contactHotlineTel,
  zaloChatUrl,
} from "@/config/site";

const altBase = siteUrlAlt.replace(/\/$/, "");
const canonicalUrl = `${altBase}/chinh-sach-doi-tra`;

const PAGE_TITLE = "Chính sách đổi trả – Ắc Quy HN";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | Ắc Quy HN`,
  description:
    "Chính sách đổi trả Ắc Quy HN: điều kiện, thời gian xử lý, hình thức đổi mới/hoàn tiền, chi phí và quy trình liên hệ.",
  keywords: [
    "chính sách đổi trả",
    "đổi ắc quy",
    "trả hàng ắc quy",
    "Ắc Quy HN",
    "lỗi nhà sản xuất",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Đổi/trả ắc quy mua tại Ắc Quy HN: điều kiện 3–7 ngày, xử lý 1–3 ngày làm việc.",
    url: canonicalUrl,
    siteName: "Ắc Quy HN",
    locale: "vi_VN",
  },
  robots: { index: true, follow: true },
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-4 pb-0">
        <Breadcrumbs items={[]} currentPage="Chính sách đổi trả" />
      </div>

      <article className="pb-10 md:pb-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <header className="mb-10 md:mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                CHÍNH SÁCH ĐỔI TRẢ – ẮC QUY HN
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Quy định đổi và trả sản phẩm ắc quy mua tại cửa hàng.
              </p>
            </header>

            <div className="prose prose-gray max-w-none space-y-10 text-gray-700">
              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  1. Phạm vi áp dụng
                </h2>
                <p className="mt-3 leading-relaxed">
                  Chính sách đổi trả áp dụng cho tất cả sản phẩm ắc quy được mua
                  tại Ắc Quy HN.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  2. Điều kiện đổi trả
                </h2>
                <p className="mt-3 leading-relaxed">
                  Khách hàng được hỗ trợ đổi/trả sản phẩm khi:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất</li>
                  <li>Giao sai sản phẩm so với đơn đặt hàng</li>
                  <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                </ul>
                <div className="not-prose mt-6 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-gray-800">
                  <p className="font-semibold text-gray-900">
                    📌 Điều kiện kèm theo:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                    <li>Còn hóa đơn hoặc thông tin mua hàng</li>
                    <li>Sản phẩm còn nguyên tem, chưa bị can thiệp sửa chữa</li>
                    <li>
                      Thời gian yêu cầu đổi trả trong vòng 3 – 7 ngày kể từ khi
                      nhận hàng
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  3. Trường hợp không áp dụng đổi trả
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Sản phẩm đã qua sử dụng không đúng cách</li>
                  <li>Ắc quy bị chai do hao mòn tự nhiên</li>
                  <li>Hư hỏng do va đập, rơi vỡ, ngập nước</li>
                  <li>Khách hàng tự ý tháo lắp hoặc sửa chữa</li>
                  <li>Lỗi do hệ thống điện của xe gây ra</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  4. Thời gian xử lý đổi trả
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Kiểm tra và xác nhận: trong vòng 24 giờ</li>
                  <li>Hoàn tất đổi/trả: từ 1 – 3 ngày làm việc</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  5. Hình thức đổi trả
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Đổi mới sản phẩm tương đương nếu lỗi do nhà sản xuất</li>
                  <li>Hoàn tiền nếu không có sản phẩm thay thế phù hợp</li>
                  <li>
                    Hoặc thỏa thuận phương án xử lý tốt nhất cho khách hàng
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  6. Chi phí đổi trả
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Miễn phí nếu lỗi từ phía nhà sản xuất hoặc cửa hàng</li>
                  <li>
                    Khách hàng chịu phí vận chuyển nếu đổi trả do nhu cầu cá
                    nhân
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  7. Quy trình đổi trả
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>
                    Liên hệ hotline hoặc{" "}
                    <a
                      href={zaloChatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      Zalo
                    </a>{" "}
                    của cửa hàng
                  </li>
                  <li>Cung cấp thông tin đơn hàng và tình trạng sản phẩm</li>
                  <li>Nhân viên xác nhận và hướng dẫn đổi trả</li>
                  <li>Tiến hành đổi mới hoặc hoàn tiền theo quy định</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  8. Thông tin liên hệ
                </h2>
                <p className="mt-3 leading-relaxed">
                  Mọi yêu cầu đổi trả vui lòng liên hệ:
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
                  <p className="mt-2">
                    Zalo:{" "}
                    <a
                      href={zaloChatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      Chat Zalo
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
