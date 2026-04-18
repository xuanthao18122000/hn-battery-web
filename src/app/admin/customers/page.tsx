"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, Eye } from "lucide-react";
import {
  AdminPageHeader,
  Pagination,
  TableSkeleton,
} from "@/components/admin";
import { customersApi, Customer } from "@/lib/api/customers";
import { formatPrice } from "@/utils/format";

const getStatusBadge = (status: number) => {
  const isActive = status === 1;
  return isActive ? (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Hoạt động
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      Ngừng hoạt động
    </span>
  );
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (searchTerm) params.search = searchTerm;
      const response = await customersApi.getList(params);
      setCustomers(response.data);
      setTotal(response.total);
      setTotalPages(
        response.totalPages ?? Math.max(1, Math.ceil(response.total / itemsPerPage)),
      );
    } catch {
      setError("Không thể tải danh sách khách hàng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total,
    active: customers.filter((c) => c.status === 1).length,
    totalSpent: customers.reduce(
      (sum, c) => sum + Number(c.totalSpent || 0),
      0,
    ),
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Quản lý khách hàng"
          description="Danh sách khách hàng tự động sinh ra từ đơn hàng."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Tổng chi tiêu (trang hiện tại)
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatPrice(stats.totalSpent)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <div className="relative max-w-md">
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
                    Khách hàng
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Số điện thoại
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Số đơn
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tổng chi tiêu
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Đơn gần nhất
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
                {isLoading ? (
                  <TableSkeleton columns={8} />
                ) : customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-gray-500"
                    >
                      Chưa có khách hàng nào
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {customer.name}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {customer.phone}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {customer.email || "—"}
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-medium">
                        {customer.totalOrders}
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-medium">
                        {formatPrice(customer.totalSpent)}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {formatDate(customer.lastOrderedAt)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(customer.status)}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() =>
                            router.push(`/admin/customers/${customer.id}`)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
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
            itemLabel="khách hàng"
          />
        </Card>
      </div>
    </div>
  );
}
