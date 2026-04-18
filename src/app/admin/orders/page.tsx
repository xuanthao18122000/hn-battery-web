"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Eye, Filter } from "lucide-react";
import {
  AdminPageHeader,
  Pagination,
  TableSkeleton,
} from "@/components/admin";
import {
  ordersApi,
  Order,
  OrderStatus,
  OrderStats,
  PaymentMethod,
} from "@/lib/api/orders";
import { formatPrice } from "@/utils/format";

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

const statusOptions: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: OrderStatus.NEW, label: "Chờ xử lý" },
  { value: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
  { value: OrderStatus.SHIPPING, label: "Đang giao" },
  { value: OrderStatus.COMPLETED, label: "Hoàn tất" },
  { value: OrderStatus.CANCELLED, label: "Đã hủy" },
];

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

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | OrderStatus>(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<OrderStats | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedStatus]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await ordersApi.getStats();
      setStats(data);
    } catch {
      setStats(null);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus !== "all") params.status = selectedStatus;
      const response = await ordersApi.getList(params);
      setOrders(response.data);
      setTotal(response.total);
      setTotalPages(
        response.totalPages ??
          Math.max(1, Math.ceil(response.total / itemsPerPage)),
      );
    } catch {
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Quản lý đơn hàng"
          description="Danh sách đơn hàng từ website."
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng đơn</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total ?? 0}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats?.new ?? 0}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã xác nhận</p>
                <p className="text-2xl font-bold text-sky-600">
                  {stats?.confirmed ?? 0}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-sky-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hoàn tất</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.completed ?? 0}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Doanh thu (đã hoàn tất)
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {Number(stats?.revenue ?? 0).toLocaleString("vi-VN")} ₫
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm theo tên, số điện thoại, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="relative md:w-64">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <select
                value={selectedStatus === "all" ? "all" : String(selectedStatus)}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedStatus(
                    v === "all" ? "all" : (Number(v) as OrderStatus),
                  );
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Mã
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Khách hàng
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    SĐT
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tổng tiền
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Thanh toán
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Ngày đặt
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={8} />
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-gray-500"
                    >
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const status = orderStatusMap[order.status] ?? {
                      label: "—",
                      color: "bg-gray-100 text-gray-800",
                    };
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="py-4 px-4 text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {order.phone}
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {paymentMethodMap[order.paymentMethod] ?? "—"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatDateTime(order.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() =>
                              router.push(`/admin/orders/${order.id}`)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemLabel="đơn hàng"
          />
        </Card>
      </div>
    </div>
  );
}
