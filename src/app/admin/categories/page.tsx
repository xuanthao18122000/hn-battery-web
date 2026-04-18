"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FolderTree,
  Package,
  ChevronRight,
  ChevronDown,
  Upload,
  Download,
} from "lucide-react";
import { categoriesApi, Category } from "@/lib/api/categories";
import { AdminPageHeader, Pagination, TableSkeleton } from "@/components/admin";

// Mock data
const mockCategories = [
  {
    id: 1,
    name: "Ắc quy xe máy",
    slug: "ac-quy-xe-may",
    parentId: null,
    description: "Các loại ắc quy dành cho xe máy",
    productCount: 15,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Ắc quy xe ô tô",
    slug: "ac-quy-xe-o-to",
    parentId: null,
    description: "Các loại ắc quy dành cho xe ô tô",
    productCount: 8,
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Ắc quy xe tải",
    slug: "ac-quy-xe-tai",
    parentId: null,
    description: "Các loại ắc quy công suất lớn cho xe tải",
    productCount: 5,
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Ắc quy Globe",
    slug: "ac-quy-globe",
    parentId: 1,
    description: "Ắc quy thương hiệu Globe",
    productCount: 6,
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "Ắc quy Varta",
    slug: "ac-quy-varta",
    parentId: 1,
    description: "Ắc quy thương hiệu Varta",
    productCount: 4,
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 6,
    name: "Ắc quy Bosch",
    slug: "ac-quy-bosch",
    parentId: 1,
    description: "Ắc quy thương hiệu Bosch",
    productCount: 3,
    status: "active",
    createdAt: "2024-01-10",
  },
];

const getStatusBadge = (status: string | number) => {
  const isActive = status === "active" || status === 1;
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

export default function CategoriesPage() {
  const router = useRouter();
  
  // API state
  const [categories, setCategories] = useState<Category[]>([]);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [treeData, setTreeData] = useState<Category[]>([]);
  const itemsPerPage = 10;
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  /** API thành công (kể cả list rỗng) — không dùng mock. Chỉ `error` mới hiện mock làm fallback. */
  const [listSource, setListSource] = useState<"initial" | "api" | "mock">("initial");

  const mockAsCategories = mockCategories.map(
    (cat) =>
      ({
        ...cat,
        status: cat.status === "active" ? 1 : 0,
        productCount: cat.productCount || 0,
      }) as Category,
  );

  /** Mock: mặc định file mẫu; sau khi sửa/xóa trên mock thì dùng state `categories`. */
  const displayCategories =
    listSource === "mock"
      ? categories.length > 0
        ? categories
        : mockAsCategories
      : categories;

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchTerm]);

  // Flatten tree structure to array for display (only expanded categories)
  const flattenTree = (tree: Category[], expanded: Set<number>): Category[] => {
    const result: Category[] = [];
    const traverse = (items: Category[], level: number = 0) => {
      items.forEach((item) => {
        result.push({ ...item, level } as Category);
        // Only traverse children if category is expanded
        if (item.children && item.children.length > 0 && expanded.has(item.id)) {
          traverse(item.children, level + 1);
        }
      });
    };
    traverse(tree);
    return result;
  };

  const toggleExpand = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const fetchCategories = async () => {
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

      const response = await categoriesApi.getTreeCms(params);
      
      // Check if response is paginated or array
      let treeData: Category[];
      let totalCount = 0;
      let totalPagesCount = 1;

      if (Array.isArray(response)) {
        // Response is array (no pagination)
        const data = response;
        setTreeData(data);
        // Flatten to get total count including children
        const flattened = flattenTree(data, expandedCategories);
        totalCount = flattened.length;
        totalPagesCount = 1;
        setApiCategories(flattened);
        setCategories(flattened);
      } else {
        // Response is paginated
        const data = (response as any).data || [];
        setTreeData(data);
        // Flatten tree to array for display
        const flattened = flattenTree(data, expandedCategories);
        // Total is root categories count from backend
        totalCount = (response as any).total || 0;
        totalPagesCount = (response as any).totalPages || 1;
        setApiCategories(flattened);
        setCategories(flattened);
      }

      setTotal(totalCount);
      setTotalPages(totalPagesCount);
      setListSource("api");
    } catch (err: any) {
      setError("Không thể tải danh sách danh mục. Đang sử dụng dữ liệu mẫu.");
      setListSource("mock");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await categoriesApi.downloadImportTemplate();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "category-import-template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Không thể tải template. Vui lòng thử lại.");
    }
  };

  const handlePickImportFile = () => {
    importInputRef.current?.click();
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setIsImporting(true);
      const result = await categoriesApi.importExcel(file);
      alert(
        `Import xong. Created: ${result?.createdCount ?? 0}, Updated: ${result?.updatedCount ?? 0}, Skipped: ${result?.skippedCount ?? 0}`,
      );
      fetchCategories();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Import thất bại. Vui lòng thử lại.");
    } finally {
      setIsImporting(false);
    }
  };

  // Update categories when expanded state changes
  useEffect(() => {
    if (treeData.length > 0) {
      const flattened = flattenTree(treeData, expandedCategories);
      setCategories(flattened);
      setApiCategories(flattened);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedCategories]);

  const filteredCategories =
    listSource === "api" && categories.length > 0
      ? categories
      : listSource === "mock"
        ? displayCategories.filter((category) => {
            return (
              category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (category.description || "").toLowerCase().includes(searchTerm.toLowerCase())
            );
          })
        : [];

  // Pagination
  const calculatedTotalPages =
    listSource === "api" && categories.length > 0
      ? totalPages
      : listSource === "mock"
        ? Math.ceil(filteredCategories.length / itemsPerPage)
        : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories =
    listSource === "api" && categories.length > 0
      ? filteredCategories
      : listSource === "mock"
        ? filteredCategories.slice(startIndex, startIndex + itemsPerPage)
        : [];

  // Stats
  const stats = {
    total:
      listSource === "api" && categories.length > 0
        ? total
        : listSource === "mock"
          ? displayCategories.length
          : 0,
    active: displayCategories.filter((c) => c.status === 1 || (typeof c.status === "string" && c.status === "active")).length,
    totalProducts: displayCategories.reduce((sum, c) => sum + (c.productCount || 0), 0),
  };

  const handleAdd = () => {
    router.push("/admin/categories/new");
  };

  const handleEdit = (category: Category) => {
    router.push(`/admin/categories/${category.id}`);
  };

  const handleDelete = (category: any) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      // Check if category has children
      const hasChildren = displayCategories.some((c) => c.parentId === selectedCategory.id);
      if (hasChildren) {
        alert("Không thể xóa danh mục có danh mục con. Vui lòng xóa danh mục con trước.");
        return;
      }

      if (listSource === "api" && categories.length > 0) {
        await categoriesApi.delete(selectedCategory.id);
      } else if (listSource === "mock") {
        setCategories(displayCategories.filter((c) => c.id !== selectedCategory.id));
      }
      
      setShowDeleteModal(false);
      setSelectedCategory(null);
      
      // Refresh list
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa danh mục. Vui lòng thử lại.");
    }
  };

  const renderCategoryRow = (category: Category) => {
    const level = (category as any).level || (category.parentId ? 1 : 0);
    const parent = category.parentId
      ? displayCategories.find((c) => c.id === category.parentId)
      : null;
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50">
        <td className="py-4 px-4">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            <div className="w-6 flex items-center justify-center">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title={isExpanded ? "Thu gọn" : "Mở rộng"}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              ) : null}
            </div>
            <FolderTree className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">{category.name}</div>
              {parent && (
                <div className="text-sm text-gray-500">Thuộc: {parent.name}</div>
              )}
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className="text-sm text-gray-600">/{category.slug}</span>
        </td>
        <td className="py-4 px-4">
          <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
            {category.description || "—"}
          </div>
        </td>
        <td className="py-4 px-4">
          <span className="text-gray-900 font-medium">{category.productCount || 0}</span>
        </td>
        <td className="py-4 px-4">{getStatusBadge(category.status)}</td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Quản lý danh mục"
          description="Quản lý và tổ chức danh mục sản phẩm"
          actions={
            <div className="flex items-center gap-2">
              <input
                ref={importInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportFileChange}
              />
              <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2">
                <Download className="w-4 h-4" />
                Template import
              </Button>
              <Button
                variant="outline"
                onClick={handlePickImportFile}
                className="gap-2"
                disabled={isImporting}
              >
                <Upload className="w-4 h-4" />
                {isImporting ? "Đang import..." : "Import Excel"}
              </Button>
              <Button variant="default" onClick={handleAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm danh mục
              </Button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng danh mục</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FolderTree className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, slug, mô tả..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Categories Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tên danh mục</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Slug</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mô tả</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Số sản phẩm</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || listSource === "initial" ? (
                  <TableSkeleton columns={6} />
                ) : paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      {listSource === "api"
                        ? "Chưa có danh mục hoặc không khớp bộ lọc."
                        : "Không tìm thấy danh mục nào"}
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((category) => renderCategoryRow(category))
                )}
              </tbody>
            </table>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          {!isLoading && (
            <Pagination
              currentPage={currentPage}
              totalPages={calculatedTotalPages}
              total={
                listSource === "api" && categories.length > 0
                  ? total
                  : filteredCategories.length
              }
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemLabel="danh mục"
            />
          )}
        </Card>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa danh mục <strong>{selectedCategory.name}</strong>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Xóa
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCategory(null);
                  }}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
