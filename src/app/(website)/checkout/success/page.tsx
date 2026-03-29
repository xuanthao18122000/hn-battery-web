"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ordersApi, type Order } from "@/lib/api/orders";
import { formatPrice } from "@/utils/format";

const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function CheckBadge() {
  return (
    <div className="inline-flex items-center justify-center size-12 rounded-full bg-emerald-50 ring-1 ring-emerald-200">
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-6 text-emerald-600"
        fill="none"
      >
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function KeyValueRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-900 text-right">{value}</div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = searchParams.get("orderId");
    if (!raw) {
      setLoading(false);
      return;
    }
    const id = Number(raw);
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await ordersApi.getByIdFe(id);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
          {/* Header skeleton */}
          <div className="animate-pulse rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-12 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-72 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 xl:col-span-8 animate-pulse rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <div className="animate-pulse rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-6">
                <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="animate-pulse rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-6">
                <div className="h-6 w-44 bg-gray-200 rounded mb-3" />
                <div className="h-32 bg-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-secondary">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-8">
            <div className="mx-auto mb-4 w-fit">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-gray-50 ring-1 ring-gray-200">
                <svg viewBox="0 0 24 24" className="size-6 text-gray-500" fill="none" aria-hidden="true">
                  <path d="M12 9v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M10.3 4.5h3.4a2 2 0 0 1 1.8 1.1l5 10A2 2 0 0 1 18.7 18.5H5.3a2 2 0 0 1-1.8-2.9l5-10a2 2 0 0 1 1.8-1.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <p className="text-gray-900 font-semibold text-lg mb-1">Không tìm thấy thông tin đơn hàng</p>
            <p className="text-gray-600 text-sm mb-6">
              Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ để tiếp tục mua sắm.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <CheckBadge />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Đặt hàng thành công
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Cảm ơn bạn. Đơn hàng đã được ghi nhận và sẽ được xử lý trong thời gian sớm nhất.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:flex md:items-center gap-3 md:gap-4">
              <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 px-4 py-3">
                <div className="text-xs text-gray-500">Mã đơn hàng</div>
                <div className="text-base font-bold text-gray-900 tracking-wide">{order.code}</div>
              </div>
              <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 px-4 py-3">
                <div className="text-xs text-gray-500">Tổng tiền</div>
                <div className="text-base font-bold text-gray-900">{formatPrice(order.totalAmount)}</div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Xác nhận đơn", desc: "Hệ thống đã nhận đơn hàng của bạn." },
              { title: "Chuẩn bị hàng", desc: "Chúng tôi sẽ gọi xác nhận và chuẩn bị." },
              { title: "Giao hàng", desc: "Đơn hàng sẽ được giao theo địa chỉ." },
            ].map((s, idx) => (
              <div key={idx} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-6 rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="size-4 text-emerald-600" fill="none" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{s.title}</div>
                </div>
                <div className="text-xs text-gray-600">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order detail */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chi tiết đơn hàng</h2>
              <div className="text-xs text-gray-500">
                Ngày đặt: <span className="font-medium text-gray-800">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 hidden sm:grid sm:grid-cols-12 text-xs font-semibold text-gray-600">
                <div className="sm:col-span-7">Sản phẩm</div>
                <div className="sm:col-span-2 text-right">Số lượng</div>
                <div className="sm:col-span-3 text-right">Thành tiền</div>
              </div>

              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3"
                >
                  <div className="sm:col-span-7">
                    <div className="text-sm font-semibold text-gray-900 leading-snug">
                      {item.productSlug ? (
                        <Link href={`/${item.productSlug}`} className="hover:underline text-primary">
                          {item.productName}
                        </Link>
                      ) : (
                        item.productName
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Đơn giá: <span className="font-medium text-gray-700">{formatPrice(item.unitPrice)}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:text-right">
                    <div className="text-sm text-gray-700">
                      <span className="sm:hidden text-gray-500">Số lượng: </span>
                      <span className="font-semibold">{item.quantity}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-3 sm:text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      <span className="sm:hidden text-gray-500 font-normal">Thành tiền: </span>
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="px-4 py-4 bg-white">
                <div className="flex items-center justify-end">
                  <div className="w-full sm:w-72">
                    <KeyValueRow label="Tạm tính" value={formatPrice(order.totalAmount)} />
                    <div className="h-px bg-gray-100" />
                    <KeyValueRow
                      label="Tổng cộng"
                      value={<span className="text-base">{formatPrice(order.totalAmount)}</span>}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50"
              >
                Cần hỗ trợ? Liên hệ
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tóm tắt đơn hàng</h3>
              <div className="divide-y divide-gray-100">
                <KeyValueRow label="Mã đơn hàng" value={<span className="tracking-wide">{order.code}</span>} />
                <KeyValueRow label="Ngày" value={formatDate(order.createdAt)} />
                <KeyValueRow label="Phương thức thanh toán" value={
                  order.paymentMethod === 1
                    ? "Trả tiền mặt khi nhận hàng"
                    : order.paymentMethod === 2
                    ? "Chuyển khoản ngân hàng"
                    : "Khác"
                } />
                <KeyValueRow label="Tổng cộng" value={<span className="text-base">{formatPrice(order.totalAmount)}</span>} />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin giao hàng</h3>
              <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 p-4 text-sm text-gray-700 whitespace-pre-line">
                <div className="font-semibold text-gray-900">{order.customerName}</div>
                <div className="mt-2">{order.shippingAddress}</div>
                <div className="mt-3 text-gray-600">
                  <div>{order.phone}</div>
                  <div>{order.email}</div>
                </div>
                {order.note ? (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-gray-600">
                    <div className="text-xs font-semibold text-gray-500 mb-1">Ghi chú</div>
                    <div>{order.note}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

