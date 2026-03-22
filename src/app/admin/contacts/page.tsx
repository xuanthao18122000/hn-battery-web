"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  Package,
  Calendar,
  MessageSquare,
  X,
} from "lucide-react";
import { contactInformationsApi, ContactInformation, ContactStatus } from "@/lib/api/contact-informations";

const statusOptions = [
  { value: "all", label: "Tất cả", icon: Filter },
  { value: ContactStatus.NEW, label: "Mới", icon: Clock },
  { value: ContactStatus.CONTACTED, label: "Đã liên hệ", icon: CheckCircle2 },
  { value: ContactStatus.COMPLETED, label: "Hoàn thành", icon: CheckCircle2 },
  { value: ContactStatus.CANCELLED, label: "Đã hủy", icon: XCircle },
];

const getStatusBadge = (status: ContactStatus) => {
  const statusConfig = {
    [ContactStatus.NEW]: { label: "Mới", icon: Clock, color: "bg-blue-100 text-blue-800" },
    [ContactStatus.CONTACTED]: { label: "Đã liên hệ", icon: CheckCircle2, color: "bg-yellow-100 text-yellow-800" },
    [ContactStatus.COMPLETED]: { label: "Hoàn thành", icon: CheckCircle2, color: "bg-green-100 text-green-800" },
    [ContactStatus.CANCELLED]: { label: "Đã hủy", icon: XCircle, color: "bg-red-100 text-red-800" },
  };

  const config = statusConfig[status] || statusConfig[ContactStatus.NEW];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactInformation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const fetchingRef = useRef(false);

  const fetchContacts = useCallback(async () => {
    if (fetchingRef.current) return; // Prevent duplicate calls
    fetchingRef.current = true;
    
    setIsLoading(true);
    setError("");
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (selectedStatus !== "all") {
        params.status = selectedStatus as ContactStatus;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await contactInformationsApi.getList(params);
      
      setContacts(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError("Không thể tải danh sách liên hệ.");
      setContacts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [currentPage, selectedStatus, searchTerm, itemsPerPage]);

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Pagination
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleViewDetail = async (contact: ContactInformation) => {
    try {
      const detail = await contactInformationsApi.getById(contact.id);
      setSelectedContact(detail);
      setShowDetailModal(true);
    } catch (err) {
      setSelectedContact(contact);
      setShowDetailModal(true);
    }
  };

  const handleStatusChange = async (contactId: number, newStatus: ContactStatus) => {
    setIsUpdating(true);
    try {
      await contactInformationsApi.update(contactId, { status: newStatus });

      // Update local state
      setContacts(
        contacts.map((contact) =>
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        )
      );
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }

      // Refresh list
      await fetchContacts();
    } catch (error) {
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotesUpdate = async (contactId: number, notes: string) => {
    try {
      await contactInformationsApi.update(contactId, { notes });
      setContacts(
        contacts.map((contact) =>
          contact.id === contactId ? { ...contact, notes } : contact
        )
      );
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, notes });
      }
    } catch (error) {
    }
  };

  const handleExport = () => {
    // TODO: Implement export to CSV/Excel
    alert("Tính năng export sẽ được implement sau");
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin liên hệ</h1>
            <p className="text-gray-600">Quản lý và theo dõi thông tin khách hàng liên hệ</p>
          </div>
          <Button variant="default" onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất file
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isActive = selectedStatus === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedStatus(option.value);
                      setCurrentPage(1);
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">Đang tải thông tin liên hệ...</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Tổng số</div>
            <div className="text-2xl font-bold text-gray-900">{total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Mới</div>
            <div className="text-2xl font-bold text-blue-600">
              {contacts.filter((c) => c.status === ContactStatus.NEW).length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Đã liên hệ</div>
            <div className="text-2xl font-bold text-yellow-600">
              {contacts.filter((c) => c.status === ContactStatus.CONTACTED).length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Hoàn thành</div>
            <div className="text-2xl font-bold text-green-600">
              {contacts.filter((c) => c.status === ContactStatus.COMPLETED).length}
            </div>
          </Card>
        </div>

        {/* Contacts Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Khách hàng</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Liên hệ</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sản phẩm</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tin nhắn</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thời gian</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Không tìm thấy thông tin liên hệ nào
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {contact.productId ? (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">ID: {contact.productId}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Không có</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {contact.message}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={contact.status}
                          onChange={(e) => handleStatusChange(contact.id, e.target.value as ContactStatus)}
                          disabled={isUpdating}
                          className={`
                            text-xs font-medium px-2 py-1 rounded-full border-0
                            ${contact.status === ContactStatus.NEW ? "bg-blue-100 text-blue-800" : ""}
                            ${contact.status === ContactStatus.CONTACTED ? "bg-yellow-100 text-yellow-800" : ""}
                            ${contact.status === ContactStatus.COMPLETED ? "bg-green-100 text-green-800" : ""}
                            ${contact.status === ContactStatus.CANCELLED ? "bg-red-100 text-red-800" : ""}
                          `}
                        >
                          <option value={ContactStatus.NEW}>Mới</option>
                          <option value={ContactStatus.CONTACTED}>Đã liên hệ</option>
                          <option value={ContactStatus.COMPLETED}>Hoàn thành</option>
                          <option value={ContactStatus.CANCELLED}>Đã hủy</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {contact.createdAt ? new Date(contact.createdAt).toLocaleString("vi-VN") : ""}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewDetail(contact)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, total)} trong tổng số {total} kết quả
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        px-3 py-1 rounded text-sm font-medium
                        ${currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết liên hệ</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Tên khách hàng</label>
                      <div className="mt-1 text-gray-900 font-medium">{selectedContact.name}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Số điện thoại</label>
                      <div className="mt-1 flex items-center gap-2 text-gray-900">
                        <Phone className="w-4 h-4" />
                        {selectedContact.phone}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <div className="mt-1 flex items-center gap-2 text-gray-900">
                        <Mail className="w-4 h-4" />
                        {selectedContact.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Thời gian</label>
                      <div className="mt-1 flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4" />
                        {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString("vi-VN") : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                {selectedContact.productId && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm quan tâm</h3>
                    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">ID: {selectedContact.productId}</span>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tin nhắn</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái</h3>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => handleStatusChange(selectedContact.id, e.target.value as ContactStatus)}
                    disabled={isUpdating}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ContactStatus.NEW}>Mới</option>
                    <option value={ContactStatus.CONTACTED}>Đã liên hệ</option>
                    <option value={ContactStatus.COMPLETED}>Hoàn thành</option>
                    <option value={ContactStatus.CANCELLED}>Đã hủy</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h3>
                  <textarea
                    value={selectedContact.notes || ""}
                    onChange={(e) => {
                      const updated = { ...selectedContact, notes: e.target.value };
                      setSelectedContact(updated);
                    }}
                    onBlur={(e) => {
                      if (selectedContact) {
                        handleNotesUpdate(selectedContact.id, e.target.value);
                      }
                    }}
                    placeholder="Thêm ghi chú về khách hàng..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="default"
                    onClick={() => {
                      // TODO: Implement call/email actions
                      alert("Tính năng sẽ được implement sau");
                    }}
                    className="flex-1"
                  >
                    Gọi điện
                  </Button>
                  <Button
                    onClick={() => {
                      window.location.href = `mailto:${selectedContact.email}`;
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Gửi email
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
