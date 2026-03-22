import { BadgeCheck, Truck, PhoneCall, RefreshCw } from "lucide-react";
import Link from "next/link";

const COMMITMENTS = [
  {
    icon: BadgeCheck,
    title: "Bảo đảm chất lượng",
    description: "Sản phẩm bảo đảm chất lượng.",
  },
  {
    icon: Truck,
    title: "Miễn phí giao hàng",
    description: "Cho đơn hàng từ 2 triệu đồng.",
  },
  {
    icon: PhoneCall,
    title: "Hỗ trợ 24/7",
    description: "Hotline: 0921.55.22.66",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả hàng",
    description: "Trong vòng 7 ngày.",
  },
];

export const Commitments = () => {
  return (
    <section className="container mx-auto max-w-7xl px-4 pb-4">
      {/* CTA: Cần Tư Vấn Chọn Ắc Quy Phù Hợp? */}
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-700 px-6 py-8 md:px-12 md:py-10 text-center text-white shadow-lg">
        <h3 className="text-xl md:text-2xl font-semibold mb-2">
          Cần Tư Vấn Chọn Ắc Quy Phù Hợp?
        </h3>
        <p className="text-sm md:text-base text-blue-100 mb-6 max-w-2xl mx-auto">
          Đội ngũ chuyên gia sẽ giúp bạn chọn ắc quy phù hợp nhất cho xe với độ
          bền cao và chi phí hợp lý.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-xl bg-white px-6 md:px-8 py-2.5 text-sm md:text-base font-semibold text-gray-900 shadow-md hover:shadow-lg hover:bg-blue-50 transition-colors"
        >
          Cửa hàng gần bạn
        </Link>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 text-gray-800 md:flex-row md:items-center md:justify-between md:gap-6">
        {COMMITMENTS.map((item, index) => (
          <div key={index} className="flex items-center gap-3 md:gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-800">
              <item.icon className="h-4 w-4" />
            </div>
            <div className="leading-snug">
              <p className="text-xs font-semibold md:text-sm">{item.title}</p>
              <p className="text-[11px] text-gray-500 md:text-xs">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
