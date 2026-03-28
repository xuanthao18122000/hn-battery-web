import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/website/common";
import {
  siteUrlAlt,
  storeAddress,
  contactEmail,
  contactHotlineDisplay,
  contactHotlineTel,
  zaloChatUrl,
} from "@/config/site";

const altBase = siteUrlAlt.replace(/\/$/, "");
const canonicalUrl = `${altBase}/chinh-sach-khieu-nai`;

const PAGE_TITLE = "Chính sách khiếu nại – Ắc Quy HN";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | Ắc Quy HN`,
  description:
    "Chính sách khiếu nại Ắc Quy HN: tiếp nhận qua hotline, Zalo, cửa hàng; thời gian xử lý 1–3 ngày; quy trình và cam kết minh bạch.",
  keywords: [
    "chính sách khiếu nại",
    "gửi khiếu nại ắc quy",
    "Ắc Quy HN",
    "phản hồi khách hàng",
    "xử lý khiếu nại",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: PAGE_TITLE,
    description:
      "Tiếp nhận khiếu nại về sản phẩm, dịch vụ, giao hàng — xác nhận trong 24h, xử lý 1–3 ngày làm việc.",
    url: canonicalUrl,
    siteName: "Ắc Quy HN",
    locale: "vi_VN",
  },
  robots: { index: true, follow: true },
};

export default function ComplaintPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-4 pb-0">
        <Breadcrumbs items={[]} currentPage="Chính sách khiếu nại" />
      </div>

      <article className="pb-10 md:pb-14">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <header className="mb-10 md:mb-12">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                CHÍNH SÁCH KHIẾU NẠI – ẮC QUY HN
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Quy định tiếp nhận và xử lý phản hồi, khiếu nại của khách hàng.
              </p>
            </header>

            <div className="prose prose-gray max-w-none space-y-10 text-gray-700">
              <section>
                <h2 className="text-xl font-bold text-gray-900">1. Mục đích</h2>
                <p className="mt-3 leading-relaxed">
                  Ắc Quy HN cam kết bảo vệ quyền lợi khách hàng và luôn lắng
                  nghe, tiếp nhận mọi phản hồi, khiếu nại liên quan đến sản phẩm
                  và dịch vụ nhằm cải thiện chất lượng phục vụ.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  2. Phạm vi tiếp nhận khiếu nại
                </h2>
                <p className="mt-3 leading-relaxed">
                  Chúng tôi tiếp nhận các khiếu nại liên quan đến:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Chất lượng sản phẩm ắc quy</li>
                  <li>Dịch vụ thay thế, cứu hộ</li>
                  <li>Giao hàng, vận chuyển</li>
                  <li>Thái độ phục vụ của nhân viên</li>
                  <li>Các vấn đề phát sinh khác trong quá trình mua hàng</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  3. Hình thức tiếp nhận khiếu nại
                </h2>
                <p className="mt-3 leading-relaxed">
                  Khách hàng có thể gửi khiếu nại qua:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>
                    Hotline:{" "}
                    <a
                      href={`tel:${contactHotlineTel}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {contactHotlineDisplay}
                    </a>
                  </li>
                  <li>
                    <a
                      href={zaloChatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      Zalo
                    </a>
                    ,{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-primary font-medium hover:underline"
                    >
                      email
                    </a>{" "}
                    hoặc{" "}
                    <Link
                      href="/contact"
                      className="text-primary font-medium hover:underline"
                    >
                      trang liên hệ
                    </Link>{" "}
                    chính thức của cửa hàng
                  </li>
                  <li>Trực tiếp tại cửa hàng</li>
                </ul>
                <div className="not-prose mt-6 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-gray-800">
                  <p className="font-semibold text-gray-900">
                    📌 Khi gửi khiếu nại, vui lòng cung cấp:
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                    <li>Tên khách hàng + số điện thoại</li>
                    <li>Thông tin đơn hàng (nếu có)</li>
                    <li>Nội dung khiếu nại cụ thể</li>
                    <li>Hình ảnh/video liên quan (nếu có)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  4. Thời gian xử lý
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Xác nhận tiếp nhận khiếu nại: trong vòng 24 giờ</li>
                  <li>Thời gian xử lý: từ 1 – 3 ngày làm việc</li>
                  <li>
                    Trường hợp phức tạp có thể kéo dài hơn, nhưng sẽ thông báo
                    rõ cho khách hàng
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  5. Quy trình giải quyết khiếu nại
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Tiếp nhận thông tin từ khách hàng</li>
                  <li>Kiểm tra và xác minh nội dung</li>
                  <li>Đưa ra phương án xử lý phù hợp</li>
                  <li>Thông báo kết quả và thực hiện giải quyết</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  6. Phương án giải quyết
                </h2>
                <p className="mt-3 leading-relaxed">
                  Tùy theo từng trường hợp, chúng tôi sẽ:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Đổi mới sản phẩm</li>
                  <li>Bảo hành hoặc sửa chữa</li>
                  <li>Hoàn tiền (nếu cần thiết)</li>
                  <li>Xin lỗi và cải thiện dịch vụ</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  7. Cam kết của chúng tôi
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  <li>Xử lý nhanh chóng, minh bạch và công bằng</li>
                  <li>Đặt quyền lợi khách hàng lên hàng đầu</li>
                  <li>Không né tránh trách nhiệm khi có sai sót</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">
                  8. Thông tin liên hệ
                </h2>
                <p className="mt-3 leading-relaxed">
                  Mọi khiếu nại vui lòng liên hệ:
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
