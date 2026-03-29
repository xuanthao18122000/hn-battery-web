"use client";

import { ImageTitleCard, ViewAllLink, type ListItem } from "./newsBlockShared";

const SERVICE_ITEMS: ListItem[] = [
  {
    title: "Dịch vụ cứu hộ ắc quy 24/7 - Nhanh chóng, chuyên nghiệp",
    date: "10/03/2023",
    excerpt: "Dịch vụ cứu hộ ắc quy 24/7 của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi. Đội ngũ kỹ thuật viên chuyên nghiệp, trang thiết bị hiện đại...",
    image: "/no-image-available.png",
    href: "/dich-vu/dich-vu-cuu-ho-ac-quy-24-7",
  },
  {
    title: "Dịch vụ lắp đặt ắc quy tại nhà - Miễn phí vận chuyển",
    date: "05/03/2023",
    excerpt: "Chúng tôi cung cấp dịch vụ lắp đặt ắc quy tại nhà với đội ngũ kỹ thuật viên giàu kinh nghiệm. Miễn phí vận chuyển trong nội thành...",
    image: "/no-image-available.png",
    href: "/dich-vu/dich-vu-lap-dat-ac-quy-tai-nha",
  },
  {
    title: "Chính sách bảo hành ắc quy - Rõ ràng, minh bạch",
    date: "25/02/2023",
    excerpt: "Chúng tôi cam kết bảo hành sản phẩm ắc quy theo đúng quy định của nhà sản xuất. Chính sách bảo hành rõ ràng, minh bạch...",
    image: "/no-image-available.png",
    href: "/dich-vu/chinh-sach-bao-hanh-ac-quy",
  },
  {
    title: "Tư vấn chọn ắc quy phù hợp với xe của bạn",
    date: "20/02/2023",
    excerpt: "Đội ngũ tư vấn chuyên nghiệp sẽ giúp bạn chọn loại ắc quy phù hợp nhất với xe của bạn. Tư vấn miễn phí, nhiệt tình...",
    image: "/no-image-available.png",
    href: "/dich-vu/tu-van-chon-ac-quy-phu-hop",
  },
];

export function Service() {
  return (
    <section className="pt-4 pb-4 bg-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="animate-on-scroll fade-in-up rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="block-title">
              Dịch vụ
            </h3>
            <ViewAllLink href="/dich-vu" label="Xem tất cả" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SERVICE_ITEMS.slice(0, 4).map((item, index) => (
              <ImageTitleCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
