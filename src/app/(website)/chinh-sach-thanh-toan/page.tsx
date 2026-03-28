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
const canonicalUrl = `${altBase}/chinh-sach-thanh-toan`;

const PAGE_TITLE = "Chính sách thanh toán – Ắc Quy HN";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | Ắc Quy HN`,
  description:
    "Chính sách thanh toán Ắc Quy HN: tiền mặt, chuyển khoản, thời điểm thanh toán, xác nhận, chi phí phát sinh, hoàn tiền và liên hệ.",
  keywords: [
    "chính sách thanh toán",
    "thanh toán ắc quy",
    "chuyển khoản",
    "Ắc Quy HN",
    "thanh toán khi nhận hàng",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Phương thức thanh toán, xác nhận và hoàn tiền khi mua ắc quy & dịch vụ tại Ắc Quy HN.",
    url: canonicalUrl,
    siteName: "Ắc Quy HN",
    locale: "vi_VN",
  },
  robots: { index: true, follow: true },
};

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-4 pb-0">
        <Breadcrumbs items={[]} currentPage="Chính sách thanh toán" />
      </div>

      <article className="pb-10 md:pb-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <header className="mb-10 md:mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                CHÍNH SÁCH THANH TOÁN – ẮC QUY HN
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Quy định về hình thức và thời điểm thanh toán khi mua sản phẩm
                hoặc sử dụng dịch vụ.
              </p>
            </header>

            <div className="prose prose-gray max-w-none space-y-10 text-gray-700">
              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  1. Phương thức thanh toán
                </h2>
                <p className="mt-3 leading-relaxed">
                  Khách hàng khi mua sản phẩm hoặc sử dụng dịch vụ tại Ắc Quy HN
                  có thể lựa chọn các hình thức thanh toán sau:
                </p>
                <div className="not-prose mt-4 space-y-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Thanh toán tiền mặt
                    </p>
                    <p className="mt-2 leading-relaxed">
                      Thanh toán trực tiếp cho nhân viên khi nhận hàng hoặc sau
                      khi hoàn tất dịch vụ.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Chuyển khoản ngân hàng
                    </p>
                    <p className="mt-2 leading-relaxed">
                      Khách hàng có thể chuyển khoản theo thông tin tài khoản do
                      chúng tôi cung cấp. Nội dung chuyển khoản vui lòng ghi rõ{" "}
                      <span className="font-medium text-gray-900">
                        Tên + Số điện thoại
                      </span>{" "}
                      để tiện xác nhận.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  2. Thời điểm thanh toán
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>
                    Thanh toán ngay sau khi nhận sản phẩm hoặc hoàn tất dịch vụ
                  </li>
                  <li>
                    Đối với đơn hàng giao tận nơi, khách hàng thanh toán trực
                    tiếp cho kỹ thuật viên
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  3. Xác nhận thanh toán
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>
                    Đối với chuyển khoản, đơn hàng sẽ được xác nhận sau khi
                    chúng tôi nhận đủ tiền
                  </li>
                  <li>
                    Trong một số trường hợp, chúng tôi có thể liên hệ để xác
                    minh thông tin trước khi giao hàng
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  4. Chi phí phát sinh (nếu có)
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Giá sản phẩm/dịch vụ sẽ được báo trước khi thực hiện</li>
                  <li>
                    Có thể phát sinh chi phí di chuyển đối với các khu vực xa
                    hoặc ngoài giờ
                  </li>
                  <li>
                    Cam kết không phát sinh chi phí ngoài thỏa thuận ban đầu
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  5. Hoàn tiền
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>
                    Áp dụng trong trường hợp khách hàng đã thanh toán nhưng
                    không sử dụng dịch vụ
                  </li>
                  <li>Hoặc sản phẩm hết hàng/không cung cấp được</li>
                  <li>
                    Thời gian hoàn tiền: từ 1 – 3 ngày làm việc tùy theo hình
                    thức thanh toán
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">6. Cam kết</h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Minh bạch – rõ ràng trong mọi giao dịch</li>
                  <li>Không thu phí ẩn</li>
                  <li>Hỗ trợ khách hàng nhanh chóng, tiện lợi</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  7. Thông tin liên hệ
                </h2>
                <p className="mt-3 leading-relaxed">
                  Mọi thắc mắc về thanh toán, vui lòng liên hệ:
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
