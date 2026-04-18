"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin";
import {
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  StickyNote,
  Save,
} from "lucide-react";
import {
  ordersApi,
  Order,
  OrderStatus,
  PaymentMethod,
} from "@/lib/api/orders";
import { formatPrice } from "@/utils/format";
import { toast } from "sonner";

const orderStatusMap: Record<number, { label: string; color: string }> = {
  [OrderStatus.NEW]: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
  },
  [OrderStatus.CONFIRMED]: {
    label: "Đã xác nhận",
    color: "bg-sky-100 text-sky-800",
  },
  [OrderStatus.SHIPPING]: {
    label: "Đang giao",
    color: "bg-purple-100 text-purple-800",
  },
  [OrderStatus.COMPLETED]: {
    label: "Hoàn tất",
    color: "bg-green-100 text-green-800",
  },
  [OrderStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
  },
};

const paymentMethodMap: Record<number, string> = {
  [PaymentMethod.COD]: "COD",
  [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản",
  [PaymentMethod.OTHER]: "Khác",
};

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params?.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.NEW);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrder = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await ordersApi.getById(orderId);
      setOrder(data);
      setStatus(data.status);
      setNote(data.note || "");
    } catch {
      setError("Không thể tải thông tin đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!order) return;
    setIsSaving(true);
    try {
      await ordersApi.update(order.id, {
        status,
        note: note.trim() || undefined,
      });
      toast.success("Đã cập nhật đơn hàng");
      router.push("/admin/orders");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Không thể cập nhật. Vui lòng thử lại.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      setIsSaving(false);
    }
  };

  const statusBadge = orderStatusMap[order?.status ?? OrderStatus.NEW];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title={order ? `Đơn hàng #${order.id}` : "Chi tiết đơn hàng"}
          description={
            order
              ? `Đặt lúc ${formatDateTime(order.createdAt)}`
              : undefined
          }
          backHref="/admin/orders"
          actions={
            order ? (
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            ) : undefined
          }
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <Card className="p-6">
            <div className="h-40 bg-gray-100 animate-pulse rounded" />
          </Card>
        ) : order ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Khách hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Họ tên</div>
                      <div className="font-medium text-gray-900">
                        {order.customerId ? (
                          <Link
                            href={`/admin/customers/${order.customerId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {order.customerName}
                          </Link>
                        ) : (
                          order.customerName
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Số điện thoại</div>
                      <div className="font-medium text-gray-900">
                        {order.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">
                        {order.email || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Ngày đặt</div>
                      <div className="font-medium text-gray-900">
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Địa chỉ giao hàng
                      </div>
                      <div className="font-medium text-gray-900 whitespace-pre-wrap">
                        {order.shippingAddress || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Sản phẩm ({order.items?.length ?? 0})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Sản phẩm
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Đơn giá
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          SL
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.length ? (
                        order.items.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-50"
                          >
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-900">
                                {item.productName}
                              </div>
                              {item.productSlug && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  /{item.productSlug}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right text-gray-600">
                              {formatPrice(item.unitPrice)}
                            </td>
                            <td className="py-4 px-4 text-right text-gray-600">
                              {item.quantity}
                            </td>
                            <td className="py-4 px-4 text-right font-medium text-gray-900">
                              {formatPrice(item.totalPrice)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-gray-500"
                          >
                            Không có sản phẩm
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 border-t border-gray-200">
                        <td
                          colSpan={3}
                          className="py-3 px-4 text-right text-sm font-medium text-gray-700"
                        >
                          Tổng cộng
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Trạng thái
                </h3>
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge?.color ?? ""}`}
                  >
                    {statusBadge?.label ?? "—"}
                  </span>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cập nhật trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(Number(e.target.value) as OrderStatus)
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={OrderStatus.NEW}>Chờ xử lý</option>
                  <option value={OrderStatus.CONFIRMED}>Đã xác nhận</option>
                  <option value={OrderStatus.SHIPPING}>Đang giao</option>
                  <option value={OrderStatus.COMPLETED}>Hoàn tất</option>
                  <option value={OrderStatus.CANCELLED}>Đã hủy</option>
                </select>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Thanh toán
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {paymentMethodMap[order.paymentMethod] ?? "—"}
                  </span>
                </div>
                <div className="text-sm text-gray-500">Tổng thanh toán</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPrice(order.totalAmount)}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <StickyNote className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Ghi chú
                  </h3>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú khách hàng / admin..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
