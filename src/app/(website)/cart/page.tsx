"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CartItem } from "@/components/website";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import {
  loadCartFromStorage,
  saveCartToStorage,
  type CartItemData,
} from "@/lib/cart";

type ConfirmState =
  | { type: "delete_one"; item: CartItemData }
  | { type: "delete_all"; count: number }
  | null;

const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice < 1000) {
    return "Liên hệ";
  }
  return numPrice.toLocaleString("vi-VN") + " ₫";
};

function CartItemSkeleton() {
  return (
    <div className="flex gap-4 items-start w-full py-3 first:pt-0 border-b border-gray-200 last:border-b-0 animate-pulse">
      <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-lg" />
      <div className="flex-1 min-w-0 flex flex-col gap-2 justify-center">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="flex flex-col gap-3 items-end shrink-0 w-[104px]">
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        <div className="h-8 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <main className="min-h-screen bg-(--color-bg-page) mb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-2">
            <div className="bg-white rounded-2xl px-4 py-3 flex items-center relative">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="absolute left-1/2 -translate-x-1/2 h-5 w-36 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="bg-white rounded-2xl px-4 py-3 flex flex-col">
              <CartItemSkeleton />
              <CartItemSkeleton />
              <CartItemSkeleton />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                    <div className="h-6 w-28 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg w-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const hasProcessedUrlProductRef = useRef(false);

  useEffect(() => {
    setCartItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCartToStorage(cartItems);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (!hydrated || hasProcessedUrlProductRef.current) return;
    hasProcessedUrlProductRef.current = true;

    const productData = searchParams.get("product");
    if (!productData) return;

    try {
      const product = JSON.parse(decodeURIComponent(productData));
      const quantity = parseInt(searchParams.get("quantity") || "1");

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
        amount: quantity,
      };

      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.product_id === product.product_id
        );
        if (existingIndex >= 0) {
          return prev.map((item, idx) =>
            idx === existingIndex
              ? { ...item, amount: item.amount + quantity }
              : item
          );
        }
        return [...prev, newItem];
      });

      router.replace("/cart", { scroll: false });
    } catch {
      // Invalid product data in URL — ignore silently
    }
  }, [searchParams, router, hydrated]);

  const handleUpdateQuantity = (
    item: CartItemData,
    action: "incre" | "deincre"
  ) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.cart_item_id !== item.cart_item_id) return i;
        if (action === "incre") return { ...i, amount: i.amount + 1 };
        if (action === "deincre" && i.amount > 1)
          return { ...i, amount: i.amount - 1 };
        return i;
      })
    );
  };

  const handleDelete = (item: CartItemData) => {
    setConfirmState({ type: "delete_one", item });
  };

  const handleDeleteAll = () => {
    if (cartItems.length === 0) return;
    setConfirmState({ type: "delete_all", count: cartItems.length });
  };

  const handleConfirmDelete = () => {
    if (!confirmState) return;
    if (confirmState.type === "delete_one") {
      setCartItems((prev) =>
        prev.filter((i) => i.cart_item_id !== confirmState.item.cart_item_id)
      );
    } else {
      setCartItems([]);
    }
  };

  if (!hydrated) return <CartSkeleton />;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.amount,
    0
  );

  return (
    <main className="min-h-screen bg-(--color-bg-page) mb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>
            <Link
              href="/"
              className="bg-primary hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-opacity"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-2">
              <div className="bg-white rounded-2xl px-4 py-3 flex items-center relative">
                <Link
                  href="/"
                  className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg hover:bg-gray-100 text-gray-700 shrink-0"
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-medium text-gray-900">
                  Giỏ hàng của bạn
                </h1>
              </div>

              <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-gray-900 truncate">
                  Giỏ hàng ({cartItems.length} sản phẩm)
                </span>
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="text-sm font-medium text-gray-400 hover:text-gray-600 px-2 py-1.5 shrink-0"
                >
                  Xoá tất cả
                </button>
              </div>

              <div className="bg-white rounded-2xl px-4 py-3 flex flex-col">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.cart_item_id}
                    item={item}
                    onUpdate={handleUpdateQuantity}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span
                      className={`font-medium ${formatPrice(totalPrice) === "Liên hệ" ? "text-yellow-600" : "text-primary"}`}
                    >
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="text-gray-900">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Tổng cộng:
                      </span>
                      <span
                        className={`text-xl font-bold ${formatPrice(totalPrice) === "Liên hệ" ? "text-yellow-600" : "text-primary"}`}
                      >
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-primary hover:opacity-90 text-white font-semibold py-4 px-6 rounded-lg transition-opacity flex items-center justify-center gap-2"
                >
                  Tiến hành đặt hàng
                </Link>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Chính sách bảo mật
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          open={!!confirmState}
          onClose={() => setConfirmState(null)}
          onConfirm={handleConfirmDelete}
          title={
            confirmState?.type === "delete_one"
              ? "Xóa sản phẩm?"
              : "Xóa sản phẩm khỏi giỏ hàng?"
          }
          message={
            confirmState?.type === "delete_one"
              ? "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
              : confirmState
                ? `Bạn có chắc muốn xóa ${confirmState.count} sản phẩm khỏi giỏ hàng?`
                : ""
          }
          confirmText="Đồng ý"
          cancelText="Hủy"
          variant="danger"
        />
      </div>
    </main>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
