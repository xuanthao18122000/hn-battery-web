"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { contactHotlineDisplay, contactHotlineTel } from "@/config/site";
import { ProductCommitments } from "./ProductCommitments";
import { formatPrice } from "@/utils/format";
import {
  loadCartFromStorage,
  saveCartToStorage,
  type CartItemData,
} from "@/lib/cart";
import { ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { contactInformationsApi } from "@/lib/api/contact-informations";

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
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const hasDiscount = showPrice && listPrice && parseFloat(listPrice) > parseFloat(price);

  const availabilityText =
    product?.status === "A" || product?.status === "1" ? "Còn hàng" : "Hết hàng";
  const brandText = product?.brand || "GS";

  const handleBuyNow = () => {
    if (product) {
      const productData = encodeURIComponent(JSON.stringify(product));
      router.push(`/checkout?mode=buynow&product=${productData}&quantity=${quantity}`);
    } else {
      setShowOrderModal(true);
    }
  };

  const handleAddToCart = () => {
    if (!product) {
      setShowOrderModal(true);
      return;
    }

    const q = Number.isFinite(quantity) && quantity >= 1 ? quantity : 1;
    const items = loadCartFromStorage();

    const existingIndex = items.findIndex((it) => it.product_id === product.product_id);
    let next: CartItemData[];
    if (existingIndex >= 0) {
      next = items.map((it, idx) =>
        idx === existingIndex ? { ...it, amount: it.amount + q } : it,
      );
    } else {
      const newItem: CartItemData = {
        cart_item_id: Date.now(),
        product_id: product.product_id,
        product: product.product,
        productSlug: product.productSlug,
        rootCategorySlug: product.rootCategorySlug ?? "",
        thumbnail: product.thumbnail ?? "",
        price: product.price,
        list_price: product.list_price || product.price,
        percentage_discount: product.percentage_discount ?? 0,
        amount: q,
      };
      next = [...items, newItem];
    }

    saveCartToStorage(next);
    window.dispatchEvent(new CustomEvent("cart-updated"));
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  const handleOpenOrderModal = () => setShowOrderModal(true);
  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setMessage("");
  };

  const handleSubmitOrder = async () => {
    const name = fullName.trim();
    const phoneValue = phone.trim();
    if (!name || !phoneValue) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    setIsSubmitting(true);
    try {
      await contactInformationsApi.createFe({
        name,
        phone: phoneValue,
        email: email.trim() || undefined,
        notes: message.trim() || undefined,
        productId: product?.product_id,
      });
      toast.success("Đã gửi thông tin. Chúng tôi sẽ liên hệ lại sớm!");
      handleCloseOrderModal();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Gửi thông tin thất bại. Vui lòng thử lại.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Tình trạng:</span>{" "}
            {availabilityText}
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
              className="w-full h-[52px] text-center px-2 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 text-gray-900"
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

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ hàng"
            title="Thêm vào giỏ hàng"
            className="shrink-0 inline-flex items-center justify-center h-[52px] w-[52px] border-2 border-primary-600 text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
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
          Gọi{" "}
          <a href={`tel:${contactHotlineTel}`} className="text-primary-600 font-semibold hover:underline">
            {contactHotlineDisplay}
          </a>{" "}
          để được tư vấn (Miễn phí)
        </p>
      </div>

      {/* Drawer đặt hàng */}
      <Drawer
        open={showOrderModal}
        onOpenChange={(open) => {
          if (!open) handleCloseOrderModal();
          else setShowOrderModal(true);
        }}
        direction="bottom"
      >
        <DrawerContent variant="bottom">
          <DrawerHeader className="px-6 pt-6 text-left border-b border-gray-100 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DrawerTitle>Để lại thông tin đặt hàng</DrawerTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                </p>
              </div>
              <DrawerClose className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {product && (
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                {product.thumbnail && (
                  <img
                    src={product.thumbnail}
                    alt={product.product}
                    className="w-14 h-14 object-contain rounded bg-white"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                    {product.product}
                  </div>
                  {showPrice && (
                    <div className="text-sm text-primary-600 font-semibold mt-1">
                      {formatPrice(price)}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                placeholder="Ghi chú thêm về yêu cầu đặt hàng..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
              />
            </div>
          </div>

          <DrawerFooter className="flex-row gap-3">
            <button
              type="button"
              onClick={handleCloseOrderModal}
              disabled={isSubmitting}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Đang gửi..." : "GỬI ĐI"}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
