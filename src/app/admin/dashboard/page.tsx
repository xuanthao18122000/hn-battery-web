"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Package, 
  FolderTree, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";
import Link from "next/link";

// Mock data - sẽ thay thế bằng API call thực tế
const mockStats = {
  totalContacts: 156,
  totalProducts: 342,
  totalCategories: 28,
  totalPosts: 45,
  newContactsToday: 8,
  newContactsThisWeek: 32,
  newContactsThisMonth: 89,
};

const mockRecentContacts = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    message: "Tôi muốn tư vấn về sản phẩm ắc quy cho xe máy",
    product: "Ắc quy Globe 12V 7Ah",
    status: "new",
    createdAt: "2024-01-15 14:30",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@email.com",
    message: "Cần hỗ trợ lắp đặt ắc quy tại nhà",
    product: "Ắc quy Varta 12V 9Ah",
    status: "contacted",
    createdAt: "2024-01-15 10:15",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    email: "levanc@email.com",
    message: "Hỏi về giá và bảo hành",
    product: "Ắc quy Bosch 12V 12Ah",
    status: "new",
    createdAt: "2024-01-14 16:45",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    email: "phamthid@email.com",
    message: "Cần tư vấn ắc quy cho xe tải",
    product: "Ắc quy Rocket 12V 200Ah",
    status: "completed",
    createdAt: "2024-01-14 09:20",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0945678901",
    email: "hoangvane@email.com",
    message: "Đặt lịch cứu hộ ắc quy",
    product: null,
    status: "new",
    createdAt: "2024-01-13 15:10",
  },
];

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = "blue" 
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: "up" | "down";
  trendValue?: string;
  color?: "blue" | "green" | "orange" | "purple";
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    new: { label: "Mới", icon: Clock, color: "bg-blue-100 text-blue-800" },
    contacted: { label: "Đã liên hệ", icon: CheckCircle2, color: "bg-yellow-100 text-yellow-800" },
    completed: { label: "Hoàn thành", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
    cancelled: { label: "Đã hủy", icon: XCircle, color: "bg-red-100 text-red-800" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("month");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Quản Trị
          </h1>
          <p className="text-gray-600">
            Tổng quan về hoạt động của website
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Tổng số liên hệ"
            value={mockStats.totalContacts}
            icon={MessageSquare}
            trend="up"
            trendValue="+12% so với tháng trước"
            color="blue"
          />
          <StatCard
            title="Sản phẩm"
            value={mockStats.totalProducts}
            icon={Package}
            color="green"
          />
          <StatCard
            title="Danh mục"
            value={mockStats.totalCategories}
            icon={FolderTree}
            color="orange"
          />
          <StatCard
            title="Bài viết"
            value={mockStats.totalPosts}
            icon={FileText}
            color="purple"
          />
        </div>

        {/* Contact Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Liên hệ hôm nay</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{mockStats.newContactsToday}</p>
            <p className="text-sm text-gray-500 mt-2">Liên hệ mới</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Liên hệ tuần này</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-green-600">{mockStats.newContactsThisWeek}</p>
            <p className="text-sm text-gray-500 mt-2">Tăng 15% so với tuần trước</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Liên hệ tháng này</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{mockStats.newContactsThisMonth}</p>
            <p className="text-sm text-gray-500 mt-2">Tăng 8% so với tháng trước</p>
          </Card>
        </div>

        {/* Recent Contacts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Thông tin liên hệ mới nhất</h2>
            <Link 
              href="/admin/contacts"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              Xem tất cả
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tên khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Số điện thoại</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sản phẩm quan tâm</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thời gian</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mockRecentContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{contact.phone}</td>
                    <td className="py-4 px-4 text-gray-600">{contact.email}</td>
                    <td className="py-4 px-4">
                      {contact.product ? (
                        <span className="text-sm text-gray-700">{contact.product}</span>
                      ) : (
                        <span className="text-sm text-gray-400">Không có</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{contact.createdAt}</td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/products" className="block">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quản lý sản phẩm</h3>
                  <p className="text-sm text-gray-500">Thêm, sửa, xóa sản phẩm</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/categories" className="block">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FolderTree className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quản lý danh mục</h3>
                  <p className="text-sm text-gray-500">Quản lý danh mục sản phẩm</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/posts" className="block">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quản lý bài viết</h3>
                  <p className="text-sm text-gray-500">Viết và quản lý bài viết</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
