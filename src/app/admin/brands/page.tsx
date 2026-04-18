"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { brandsApi, Brand } from "@/lib/api/brands";
import { Search, Plus, Edit, Tag, Upload } from "lucide-react";
import { AdminPageHeader, BrandImportModal, Pagination, TableSkeleton } from "@/components/admin";

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const itemsPerPage = 10;
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm]);

  const fetchBrands = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (searchTerm) {
        params.name = searchTerm;
      }
      const response = await brandsApi.getList(params);
      setBrands(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError("Không thể tải danh sách thương hiệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    router.push("/admin/brands/new");
  };

  const handleEdit = (brand: Brand) => {
    router.push(`/admin/brands/${brand.id}`);
  };

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

  const stats = {
    total,
    active: brands.filter((b) => b.status === 1).length,
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Quản lý thương hiệu"
          description="Quản lý danh sách thương hiệu ắc quy hiển thị trên website."
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setImportOpen(true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Excel
              </Button>
              <Button variant="default" onClick={handleAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm thương hiệu
              </Button>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng thương hiệu</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Tag className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, slug..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tên thương hiệu
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Slug
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Logo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Ưu tiên
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
                  <TableSkeleton columns={6} />
                ) : brands.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      Không tìm thấy thương hiệu nào
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr key={brand.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{brand.name}</div>
                        {brand.description && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {brand.description}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">/{brand.slug}</td>
                      <td className="py-4 px-4">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl.startsWith("http") ? brand.logoUrl : brand.logoUrl}
                            alt={brand.name}
                            className="w-10 h-10 object-contain rounded bg-gray-50 border border-gray-100"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-100 text-gray-500 text-sm font-semibold">
                            {brand.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{brand.priority}</td>
                      <td className="py-4 px-4">{getStatusBadge(brand.status)}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* Không có nút xóa theo yêu cầu (CRU not D) */}
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
            itemLabel="thương hiệu"
          />
        </Card>
      </div>
      {/* Import Modal */}
      {importOpen && (
        <BrandImportModal
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onImported={fetchBrands}
        />
      )}
    </div>
  );
}

