"use client";

import { Check, Gift } from "lucide-react";

const CARD_1 = {
  icon: Check,
  iconBg: "bg-[#142846]",
  title: "Cam kết chính hãng",
  items: [
    "Sản phẩm chính hãng Ắc Quy HN Sài Gòn",
    "Đầy đủ phụ kiện: ắc quy, sách hướng dẫn",
    "Hóa đơn VAT, hỗ trợ đổi trả theo quy định",
  ],
};

const CARD_2 = {
  icon: Gift,
  iconBg: "bg-[#142846]",
  title: "Bảo hành & Ưu đãi",
  items: [
    "Đổi trả trong 33 ngày nếu lỗi nhà sản xuất",
    "Bảo hành chính hãng 09 tháng",
    "Hỗ trợ bảo dưỡng miễn phí trong thời hạn BH",
  ],
};

interface ProductCommitmentsProps {
  hideHeading?: boolean;
}

export function ProductCommitments({ hideHeading = false }: ProductCommitmentsProps) {
  return (
    <div>
      {!hideHeading && (
        <h3 className="text-base font-semibold text-gray-900 mb-4">Cam kết sản phẩm</h3>
      )}

      {/* Gộp 2 mục thành 1 khung để FE gọn hơn */}
      <div className="mb-4 border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
        {[CARD_1, CARD_2].map((card, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center`}
              >
                <card.icon className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">{card.title}</h4>
            </div>

            <ul className="space-y-1 text-sm text-gray-700">
              {card.items.map((text, j) => (
                <li key={j} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
