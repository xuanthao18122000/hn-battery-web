"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  AdminPageHeader,
  Pagination,
  TableSkeleton,
} from "@/components/admin";
import {
  ShoppingBag,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { customersApi, Customer } from "@/lib/api/customers";
import { Order, OrderStatus, PaymentMethod } from "@/lib/api/orders";
import { ContactInformation, ContactStatus } from "@/lib/api/contact-informations";
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

const contactStatusMap: Record<string, { label: string; color: string }> = {
  [ContactStatus.NEW]: { label: "Mới", color: "bg-blue-100 text-blue-800" },
  [ContactStatus.CONTACTED]: {
    label: "Đã liên hệ",
    color: "bg-yellow-100 text-yellow-800",
  },
  [ContactStatus.COMPLETED]: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
  },
  [ContactStatus.CANCELLED]: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
  },
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

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = Number(params?.id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [contactsPage, setContactsPage] = useState(1);
  const [contactsTotalPages, setContactsTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!customerId) return;
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, currentPage]);

  useEffect(() => {
    if (!customerId) return;
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, contactsPage]);

  const fetchCustomer = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await customersApi.getById(customerId);
      setCustomer(data);
    } catch {
      setError("Không thể tải thông tin khách hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await customersApi.getOrders(customerId, {
        page: currentPage,
        limit: itemsPerPage,
      });
      setOrders(response.data);
      setTotalOrders(response.total);
      setTotalPages(
        response.totalPages ??
          Math.max(1, Math.ceil(response.total / itemsPerPage)),
      );
    } catch {
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const response = await customersApi.getContacts(customerId, {
        page: contactsPage,
        limit: itemsPerPage,
      });
      setContacts(response.data);
      setTotalContacts(response.total);
      setContactsTotalPages(
        response.totalPages ??
          Math.max(1, Math.ceil(response.total / itemsPerPage)),
      );
    } catch {
      setContacts([]);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Chi tiết khách hàng"
          description={customer?.name}
          backHref="/admin/customers"
        />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <Card className="p-6 mb-6">
            <div className="h-32 bg-gray-100 animate-pulse rounded" />
          </Card>
        ) : customer ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Thông tin khách hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Họ tên</div>
                      <div className="font-medium text-gray-900">
                        {customer.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Số điện thoại</div>
                      <div className="font-medium text-gray-900">
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">
                        {customer.email || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Ngày tạo</div>
                      <div className="font-medium text-gray-900">
                        {formatDateTime(customer.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Địa chỉ gần nhất
                      </div>
                      <div className="font-medium text-gray-900">
                        {customer.address || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Thống kê
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Tổng số đơn
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {customer.totalOrders}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Tổng chi tiêu
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(customer.totalSpent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Đơn gần nhất
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatDateTime(customer.lastOrderedAt)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Danh sách đơn hàng ({totalOrders})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Mã đơn
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Ngày đặt
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Số SP
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
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingOrders ? (
                      <TableSkeleton columns={7} rows={5} />
                    ) : orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-gray-500"
                        >
                          Khách hàng chưa có đơn hàng nào
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
                            <td className="py-4 px-4">
                              <span className="font-medium text-gray-900">
                                #{order.id}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {formatDateTime(order.createdAt)}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {order.items?.length ?? 0}
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
                            <td className="py-4 px-4">
                              <Link
                                href={`/admin/orders/${order.id}`}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                Xem
                              </Link>
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
                total={totalOrders}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                itemLabel="đơn hàng"
              />
            </Card>

            <Card className="overflow-hidden mt-6">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Yêu cầu liên hệ ({totalContacts})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Mã
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Thời gian
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Sản phẩm
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Ghi chú
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingContacts ? (
                      <TableSkeleton columns={5} rows={5} />
                    ) : contacts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-gray-500"
                        >
                          Khách hàng chưa gửi yêu cầu liên hệ nào
                        </td>
                      </tr>
                    ) : (
                      contacts.map((contact) => {
                        const status = contactStatusMap[contact.status] ?? {
                          label: "—",
                          color: "bg-gray-100 text-gray-800",
                        };
                        return (
                          <tr
                            key={contact.id}
                            className="border-b border-gray-50 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4 font-medium text-gray-900">
                              #{contact.id}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {formatDateTime(contact.createdAt)}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {contact.productId
                                ? `ID: ${contact.productId}`
                                : "—"}
                            </td>
                            <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                              {contact.notes || "—"}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                              >
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={contactsPage}
                totalPages={contactsTotalPages}
                total={totalContacts}
                itemsPerPage={itemsPerPage}
                onPageChange={setContactsPage}
                itemLabel="yêu cầu"
              />
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
