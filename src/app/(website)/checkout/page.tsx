"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlurImage } from "@/components/website/common";
import { ordersApi, type CreateOrderDto } from "@/lib/api/orders";
import { loadCartFromStorage, type CartItemData } from "@/lib/cart";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/utils/format";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn-v2.didongviet.vn";

// --- Validation ---
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 255;
const MIN_ADDRESS_LENGTH = 10;
const MAX_ADDRESS_LENGTH = 500;
const MAX_NOTE_LENGTH = 500;
const PHONE_REGEX = /^(0|\+84)[3-9][0-9]{8,9}$/; // 10–11 số, bắt đầu 0 hoặc +84
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CheckoutErrors = Partial<Record<"fullName" | "phone" | "email" | "address" | "note", string>>;

function validateCheckout(data: {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}): CheckoutErrors {
  const err: CheckoutErrors = {};
  const name = data.fullName?.trim() ?? "";
  const phone = data.phone?.trim().replace(/\s/g, "") ?? "";
  const email = data.email?.trim() ?? "";
  const address = data.address?.trim() ?? "";

  if (!name) err.fullName = "Vui lòng nhập họ và tên.";
  else if (name.length < MIN_NAME_LENGTH) err.fullName = `Họ tên tối thiểu ${MIN_NAME_LENGTH} ký tự.`;
  else if (name.length > MAX_NAME_LENGTH) err.fullName = `Họ tên tối đa ${MAX_NAME_LENGTH} ký tự.`;

  if (!phone) err.phone = "Vui lòng nhập số điện thoại.";
  else if (!PHONE_REGEX.test(phone)) err.phone = "Số điện thoại không hợp lệ (VD: 0365779327 hoặc +84365779327).";

  if (!email) err.email = "Vui lòng nhập email.";
  else if (!EMAIL_REGEX.test(email)) err.email = "Email không đúng định dạng.";

  if (!address) err.address = "Vui lòng nhập địa chỉ giao hàng.";
  else if (address.length < MIN_ADDRESS_LENGTH) err.address = `Địa chỉ tối thiểu ${MIN_ADDRESS_LENGTH} ký tự.`;
  else if (address.length > MAX_ADDRESS_LENGTH) err.address = `Địa chỉ tối đa ${MAX_ADDRESS_LENGTH} ký tự.`;

  const note = data.note?.trim() ?? "";
  if (note.length > MAX_NOTE_LENGTH) err.note = `Ghi chú tối đa ${MAX_NOTE_LENGTH} ký tự.`;

  return err;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});

  useEffect(() => {
    setCartItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.amount, 0);

  const setFieldError = (field: keyof CheckoutErrors, message: string | undefined) => {
    setErrors((prev) => (message === undefined ? { ...prev, [field]: undefined } : { ...prev, [field]: message }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm từ giỏ hàng.");
      return;
    }

    const nextErrors = validateCheckout({
      fullName,
      phone,
      email,
      address,
      note,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = (["fullName", "phone", "email", "address", "note"] as const).find((k) => nextErrors[k]);
      if (firstKey) document.getElementById(`checkout-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      setIsSubmitting(true);
      const orderPayload: CreateOrderDto = {
        customerName: fullName,
        phone,
        email,
        shippingAddress: address,
        note,
        totalAmount: totalPrice,
        paymentMethod: paymentMethod === "cod" ? 1 : 2,
        items: cartItems.map((item) => ({
          productId: item.product_id,
          productName: item.product,
          productSlug: item.productSlug,
          quantity: item.amount,
          unitPrice: parseFloat(item.price),
        })),
      };

      const order = await ordersApi.createFe(orderPayload);
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (image: string): string => {
    if (!image || typeof image !== "string") return "/no-image-available.png";
    if (image.startsWith("http")) return image;
    const cleanPath = image.startsWith("/") ? image.slice(1) : image;
    return `${CDN_URL}/${cleanPath}`;
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="mb-6">
            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg p-6 animate-pulse space-y-6">
              <div className="h-6 w-52 bg-gray-200 rounded" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-12 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                <div className="space-y-4 mb-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex gap-4 pb-4 border-b border-gray-200">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded-lg w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="mb-6">
            <Link href="/cart" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <span>←</span> Quay lại giỏ hàng
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào để thanh toán. Vui lòng thêm sản phẩm từ giỏ hàng.</p>
            <Link href="/cart" className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="mb-6">
          <Link href="/cart" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            <span>←</span> Quay lại giỏ hàng
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 bg-white rounded-lg p-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">THÔNG TIN KHÁCH HÀNG</h2>
                <div className="space-y-4">
                  <div id="checkout-fullName">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setFieldError("fullName", undefined);
                      }}
                      placeholder="Nhập họ và tên"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "err-fullName" : undefined}
                    />
                    {errors.fullName && <p id="err-fullName" className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>
                  <div id="checkout-phone">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setFieldError("phone", undefined);
                      }}
                      placeholder="VD: 0365779327 hoặc +84365779327"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "err-phone" : undefined}
                    />
                    {errors.phone && <p id="err-phone" className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  <div id="checkout-email">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setFieldError("email", undefined);
                      }}
                      placeholder="Nhập email"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                    />
                    {errors.email && <p id="err-email" className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div id="checkout-address">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ <span className="text-red-500">*</span></label>
                    <textarea
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setFieldError("address", undefined);
                      }}
                      placeholder="Nhập địa chỉ cụ thể. Số nhà, tên đường..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.address ? "border-red-500" : "border-gray-300"}`}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "err-address" : undefined}
                    />
                    {errors.address && <p id="err-address" className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                </div>
              </div>
              <div id="checkout-note">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng</label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    if (errors.note) setFieldError("note", undefined);
                  }}
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.note ? "border-red-500" : "border-gray-300"}`}
                  aria-invalid={!!errors.note}
                  aria-describedby={errors.note ? "err-note" : undefined}
                />
                {errors.note && <p id="err-note" className="mt-1 text-sm text-red-600">{errors.note}</p>}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">ĐƠN HÀNG CỦA BẠN</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.cart_item_id} className="flex gap-4 pb-4 border-b border-gray-200">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <BlurImage
                          src={getImageUrl(item.thumbnail)}
                          alt={item.product}
                          fill
                          className="w-full h-full object-contain"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{item.product}</h3>
                        <p className={`text-base font-bold ${formatPrice(item.price) === "Liên hệ" ? "text-yellow-600" : "text-red-600"}`}>{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">TẠM TÍNH</span>
                    <span className={`font-medium ${formatPrice(totalPrice) === "Liên hệ" ? "text-yellow-600" : "text-red-600"}`}>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">TỔNG</span>
                    <span className={`text-xl font-bold ${formatPrice(totalPrice) === "Liên hệ" ? "text-yellow-600" : "text-red-600"}`}>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Phương thức thanh toán</h3>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="payment" value="bank" checked={paymentMethod === "bank"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                        {paymentMethod === "bank" && (
                          <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
                            Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.
                          </div>
                        )}
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 w-4 h-4 text-primary focus:ring-primary" />
                      <span className="text-sm font-medium text-gray-900">Trả tiền mặt khi nhận hàng</span>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors uppercase"
                >
                  {isSubmitting ? "ĐANG GỬI..." : "ĐẶT HÀNG"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
