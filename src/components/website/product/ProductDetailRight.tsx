"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCommitments } from "./ProductCommitments";

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

interface ProductDetailRightProps {
  price: string;
  listPrice?: string;
  percentageDiscount?: number;
  promotionInfo?: string;
  showPrice?: boolean;
  product?: {
    product_id: number;
    product: string;
    productSlug: string;
    rootCategorySlug: string;
    thumbnail: string;
    price: string;
    list_price?: string;
    percentage_discount?: number;
    showPrice?: boolean;
    status?: string;
    brand?: string;
  };
}

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice < 1000) return "Liên hệ";
  return numPrice.toLocaleString("vi-VN") + " ₫";
};

export const ProductDetailRight = ({
  price,
  listPrice,
  percentageDiscount = 0,
  showPrice = true,
  product,
}: ProductDetailRightProps) => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const hasDiscount = showPrice && listPrice && parseFloat(listPrice) > parseFloat(price);

  const availabilityText =
    product?.status === "A" || product?.status === "1" ? "Còn hàng" : "Hết hàng";
  const brandText = product?.brand || "GS";

  const handleBuyNow = () => {
    if (product) {
      const productData = encodeURIComponent(JSON.stringify(product));
      router.push(`/cart?product=${productData}&quantity=${quantity}`);
    } else {
      setShowOrderModal(true);
    }
  };

  const handleOpenOrderModal = () => setShowOrderModal(true);
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setFullName("");
    setPhone("");
  };

  const handleSubmitOrder = () => {
    if (!fullName || !phone) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    alert("Đã gửi thông tin đặt hàng thành công!");
    handleCloseOrderModal();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Price card - giống DDV */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        {/* Giá */}
        <div className="mb-4">
          <div className={`text-2xl md:text-3xl font-bold text-gray-900`}>
            {showPrice ? formatPrice(price) : "Liên hệ"}
          </div>
          {showPrice && hasDiscount && listPrice && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base text-gray-400 line-through">
                {formatPrice(listPrice)}
              </span>
              {percentageDiscount > 0 && (
                <span className="text-base font-medium text-red-500">-{percentageDiscount}%</span>
              )}
            </div>
          )}
        </div>

        {/* Thông tin nhanh */}
        <div className="mt-2 mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Tình trạng:</span>{" "}
            {availabilityText}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Thương hiệu:</span>{" "}
            {brandText}
          </p>
        </div>

        <ProductCommitments hideHeading />

        {/* Row nút: Số lượng & MUA NGAY */}
        <div className="flex items-center gap-2">
          <div className="shrink-0 w-20">
            <input
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={quantity}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setQuantity(1);
                  return;
                }
                const n = Math.floor(Number(raw));
                setQuantity(Number.isFinite(n) && n >= 1 ? n : 1);
              }}
              className="w-full h-11 text-center px-2 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-900"
              aria-label="Số lượng"
            />
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 min-w-0 py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-base rounded-lg transition-colors shadow-sm"
          >
            MUA NGAY
          </button>
        </div>
      </div>

      {/* Để lại thông tin */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <button
          type="button"
          onClick={handleOpenOrderModal}
          className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Để lại thông tin đặt hàng
        </button>
        <p className="text-sm text-gray-600 mt-3">
          Gọi <a href="tel:0868300200" className="text-primary-600 font-semibold hover:underline">0868300200</a> để được tư vấn (Miễn phí)
        </p>
      </div>

      {/* Modal đặt hàng */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseOrderModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <IconClose className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6 pr-8">Để lại thông tin đặt hàng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseOrderModal}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitOrder}
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg"
                >
                  GỬI ĐI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
