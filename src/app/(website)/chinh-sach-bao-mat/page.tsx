import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/website/common";
import {
  siteUrlAlt,
  storeAddress,
  contactEmail,
  contactHotlineDisplay,
  contactHotlineTel,
} from "@/config/site";

const altBase = siteUrlAlt.replace(/\/$/, "");
const canonicalUrl = `${altBase}/chinh-sach-bao-mat`;

const PAGE_TITLE = "Chính sách bảo mật thông tin – Ắc Quy HN";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | Ắc Quy HN`,
  description:
    "Chính sách bảo mật thông tin Ắc Quy HN: thu thập, sử dụng, lưu trữ dữ liệu khách hàng; cam kết không chia sẻ bên thứ ba; quyền của khách hàng.",
  keywords: [
    "chính sách bảo mật",
    "bảo mật thông tin cá nhân",
    "Ắc Quy HN",
    "quyền khách hàng",
    "dữ liệu đơn hàng",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Cam kết bảo vệ họ tên, SĐT, địa chỉ, email; không bán dữ liệu; cập nhật trên website.",
    url: canonicalUrl,
    siteName: "Ắc Quy HN",
    locale: "vi_VN",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-4 pb-0">
        <Breadcrumbs items={[]} currentPage="Chính sách bảo mật thông tin" />
      </div>

      <article className="pb-10 md:pb-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <header className="mb-10 md:mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                CHÍNH SÁCH BẢO MẬT THÔNG TIN – ẮC QUY HN
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Quy định thu thập, sử dụng và bảo vệ dữ liệu cá nhân của khách
                hàng.
              </p>
            </header>

            <div className="prose prose-gray max-w-none space-y-10 text-gray-700">
              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  1. Mục đích và phạm vi thu thập
                </h2>
                <p className="mt-3 leading-relaxed">
                  Ắc Quy HN thu thập thông tin khách hàng nhằm:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Xử lý đơn hàng và cung cấp dịch vụ</li>
                  <li>Liên hệ xác nhận, hỗ trợ và chăm sóc khách hàng</li>
                  <li>Cải thiện chất lượng sản phẩm, dịch vụ</li>
                </ul>
                <p className="mt-6 leading-relaxed">
                  Thông tin thu thập bao gồm:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Họ tên</li>
                  <li>Số điện thoại</li>
                  <li>Địa chỉ giao hàng</li>
                  <li>Email (nếu có)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  2. Phạm vi sử dụng thông tin
                </h2>
                <p className="mt-3 leading-relaxed">
                  Thông tin khách hàng được sử dụng để:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Giao hàng, lắp đặt và bảo hành sản phẩm</li>
                  <li>Liên hệ giải quyết khiếu nại, hỗ trợ kỹ thuật</li>
                  <li>Gửi thông tin khuyến mãi (nếu khách hàng đồng ý)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  3. Thời gian lưu trữ thông tin
                </h2>
                <p className="mt-3 leading-relaxed">
                  Thông tin khách hàng được lưu trữ trong hệ thống của chúng tôi
                  cho đến khi:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Hoàn thành mục đích sử dụng</li>
                  <li>Hoặc khách hàng yêu cầu xóa thông tin</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  4. Cam kết bảo mật thông tin
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>
                    Không chia sẻ, bán hoặc trao đổi thông tin khách hàng cho
                    bên thứ ba
                  </li>
                  <li>
                    Chỉ cung cấp thông tin khi có yêu cầu từ cơ quan pháp luật
                  </li>
                  <li>
                    Áp dụng các biện pháp bảo mật để bảo vệ dữ liệu khách hàng
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  5. Quyền của khách hàng
                </h2>
                <p className="mt-3 leading-relaxed">Khách hàng có quyền:</p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân</li>
                  <li>Từ chối nhận thông tin quảng cáo bất kỳ lúc nào</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  6. Bảo mật thanh toán
                </h2>
                <p className="mt-3 leading-relaxed">
                  Mọi thông tin thanh toán được bảo mật và không lưu trữ thông
                  tin nhạy cảm như mật khẩu ngân hàng.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  7. Thay đổi chính sách
                </h2>
                <p className="mt-3 leading-relaxed">
                  Ắc Quy HN có quyền thay đổi nội dung chính sách bảo mật bất kỳ
                  lúc nào. Nội dung cập nhật sẽ được đăng tải trên website và có
                  hiệu lực ngay khi công bố.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  8. Thông tin liên hệ
                </h2>
                <p className="mt-3 leading-relaxed">
                  Mọi thắc mắc liên quan đến bảo mật thông tin, vui lòng liên
                  hệ:
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
                    Email:{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {contactEmail}
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
