"use client";

import Link from "next/link";

const DEFAULT_SPECS: { label: string; value: string; icon: string }[] = [
  { label: "Bảo hành", value: "09 tháng chính hãng", icon: "🛡️" },
  { label: "Xuất xứ", value: "Chính hãng", icon: "✓" },
  { label: "Giao hàng", value: "Toàn quốc", icon: "🚚" },
];

interface ProductSpecsProps {
  specs?: { label: string; value: string; icon?: string }[];
}

export function ProductSpecs({ specs = DEFAULT_SPECS }: ProductSpecsProps) {
  const list = specs.length ? specs : DEFAULT_SPECS;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Thông số kỹ thuật</h3>
        <Link
          href="#thong-so"
          className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
        >
          Xem tất cả <span className="text-gray-400">&gt;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {list.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-lg" aria-hidden>
              {"icon" in item && item.icon ? item.icon : "•"}
            </span>
            <div>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-medium text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
