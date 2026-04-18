"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Save, Wand2, Pencil } from "lucide-react";
import { AdminPageHeader } from "./AdminPageHeader";
import { categoriesApi, Category, CategoryTypeEnum, type CategoryType, CreateCategoryDto, UpdateCategoryDto } from "@/lib/api/categories";
import { productsApi, Product } from "@/lib/api/products";
import { useRouter } from "next/navigation";
import SEOFields from "./SEOFields";
import { FileUpload } from "@/components/ui/file-upload";
import { Package, Edit, Eye } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { getImageUrl } from "@/utils/image";

const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { label: "Đang bán", color: "bg-green-100 text-green-800" },
    inactive: { label: "Ngừng bán", color: "bg-gray-100 text-gray-800" },
    out_of_stock: { label: "Hết hàng", color: "bg-red-100 text-red-800" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

interface CategoryFormProps {
  categoryId?: number;
  initialData?: Category;
}

export default function CategoryForm({ categoryId, initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "products">("general");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [slugMode, setSlugMode] = useState<"auto" | "manual">("auto");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    type: CategoryTypeEnum.CATEGORY as number,
    description: "",
    iconUrl: "",
    position: 0,
    status: "active",
    // SEO fields
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaRobots: "index,follow",
    canonicalUrl: "",
  });

  const isEditMode = !!categoryId;

  // Set slug mode: auto for new, manual for edit
  useEffect(() => {
    if (isEditMode) {
      setSlugMode("manual");
    } else {
      setSlugMode("auto");
    }
  }, [isEditMode]);

  // Fetch categories for parent dropdown
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when tab changes to products and in edit mode
  useEffect(() => {
    if (activeTab === "products" && isEditMode && categoryId) {
      fetchProducts();
    }
  }, [activeTab, categoryId, isEditMode, productsPage]);

  // Load category data if editing
  useEffect(() => {
    if (isEditMode && initialData) {
      const type = initialData.type ?? CategoryTypeEnum.CATEGORY;
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        parentId: type === CategoryTypeEnum.POST ? "" : (initialData.parentId?.toString() || ""),
        type,
        description: initialData.description || "",
        iconUrl: initialData.iconUrl || "",
        position: initialData.position ?? 0,
        status: initialData.status === 1 ? "active" : "inactive",
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
        metaKeywords: initialData.metaKeywords || "",
        metaRobots: initialData.metaRobots || "index,follow",
        canonicalUrl: initialData.canonicalUrl || "",
      });
    } else if (isEditMode && categoryId) {
      loadCategory();
    }
  }, [categoryId, initialData, isEditMode]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getList({ getFull: true });
      setCategories(response.data);
    } catch {}
  };

  const fetchProducts = async () => {
    if (!categoryId) return;
    setLoadingProducts(true);
    try {
      const response = await productsApi.getList({
        categoryId,
        page: productsPage,
        limit: 10,
      });
      setProducts(response.data);
      setProductsTotal(response.total);
      setProductsTotalPages(response.totalPages);
    } catch {} finally {
      setLoadingProducts(false);
    }
  };

  const loadCategory = async () => {
    if (!categoryId) return;
    setIsLoading(true);
    try {
      const category = await categoriesApi.getById(categoryId);
      const type = category.type ?? CategoryTypeEnum.CATEGORY;
      setFormData({
        name: category.name,
        slug: category.slug,
        parentId: type === CategoryTypeEnum.POST ? "" : (category.parentId?.toString() || ""),
        type,
        description: category.description || "",
        iconUrl: category.iconUrl || "",
        position: category.position ?? 0,
        status: category.status === 1 ? "active" : "inactive",
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
        metaKeywords: category.metaKeywords || "",
        metaRobots: category.metaRobots || "index,follow",
        canonicalUrl: category.canonicalUrl || "",
      });
    } catch (err: any) {
      setError("Không thể tải thông tin danh mục. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const slug = formData.slug || generateSlug(formData.name);

      if (isEditMode && categoryId) {
        const updateData: UpdateCategoryDto = {
          name: formData.name,
          slug,
          parentId:
            formData.type === CategoryTypeEnum.POST
              ? undefined
              : formData.parentId
                ? parseInt(formData.parentId)
                : undefined,
          description: formData.description || undefined,
          iconUrl: formData.iconUrl,
          position: formData.position,
          status: formData.status === "active" ? 1 : 0,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          metaRobots: formData.metaRobots || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
        };
        await categoriesApi.update(categoryId, updateData);
      } else {
        const createData: CreateCategoryDto = {
          name: formData.name,
          slug,
          type: formData.type as CategoryType,
          parentId:
            formData.type === CategoryTypeEnum.POST
              ? undefined
              : formData.parentId
                ? parseInt(formData.parentId)
                : undefined,
          description: formData.description || undefined,
          iconUrl: formData.iconUrl || undefined,
          position: formData.position,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          metaRobots: formData.metaRobots || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
        };
        await categoriesApi.create(createData);
      }

      // Redirect to list page
      router.push("/admin/categories");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể lưu danh mục. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const parentCategories = categories.filter((cat) => !cat.parentId);

  const handleSaveClick = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl w-full">
          <Card className="p-6">
            <div className="text-center text-gray-500">Đang tải...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full">
        <AdminPageHeader
          title={isEditMode ? "Sửa danh mục" : "Thêm danh mục mới"}
          backHref="/admin/categories"
          actions={
            <Button
              type="button"
              variant="default"
              onClick={handleSaveClick}
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <Save className="w-4 h-4" />
              {isSaving
                ? "Đang lưu..."
                : isEditMode
                  ? "Lưu thay đổi"
                  : "Thêm danh mục"}
            </Button>
          }
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`
                    px-4 py-2 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === "general"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  Thông tin chung
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`
                    px-4 py-2 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === "seo"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  SEO
                </button>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("products")}
                    className={`
                      px-4 py-2 text-sm font-medium border-b-2 transition-colors
                      ${
                        activeTab === "products"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }
                    `}
                  >
                    Danh sách sản phẩm
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content: Thông tin chung */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên danh mục *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({
                        ...formData,
                        name: newName,
                        slug: slugMode === "auto" ? generateSlug(newName) : formData.slug,
                      });
                    }}
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <div className="relative">
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="slug-danh-muc"
                      required
                      disabled={slugMode === "auto"}
                      className={slugMode === "auto" ? "pr-20" : "pr-20"}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSlugMode("auto");
                          setFormData({ ...formData, slug: generateSlug(formData.name) });
                        }}
                        className={`
                          p-1.5 rounded transition-colors
                          ${slugMode === "auto" 
                            ? "bg-blue-100 text-blue-600" 
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          }
                        `}
                        title="Tự động tạo slug từ tên"
                      >
                        <Wand2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSlugMode("manual");
                        }}
                        className={`
                          p-1.5 rounded transition-colors
                          ${slugMode === "manual" 
                            ? "bg-blue-100 text-blue-600" 
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          }
                        `}
                        title="Nhập thủ công"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {slugMode === "auto" 
                      ? "Tự động tạo từ tên danh mục" 
                      : "Nhập slug thủ công"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon danh mục</label>
                  <FileUpload
                    value={formData.iconUrl}
                    onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                    object="products"
                    objectId={categoryId?.toString() || "0"}
                    label=""
                    className="mb-4"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ảnh icon hiển thị trên menu (nên dùng ảnh vuông, kích thước nhỏ)</p>
                </div>

                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                    <Select
                      value={String(formData.type)}
                      onChange={(value) => {
                        const type = Number(value);
                        setFormData({
                          ...formData,
                          type,
                          parentId: type === CategoryTypeEnum.POST ? "" : formData.parentId,
                        });
                      }}
                        options={[
                        { value: String(CategoryTypeEnum.CATEGORY), label: "Danh mục (sản phẩm)" },
                        { value: String(CategoryTypeEnum.POST), label: "Bài viết" },
                      ]}
                    />
                    <p className="text-xs text-gray-500 mt-1">Chỉ chọn khi tạo mới; không đổi được khi sửa.</p>
                  </div>
                )}

                {formData.type !== CategoryTypeEnum.POST && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
                    <Select
                      value={formData.parentId}
                      onChange={(value) => setFormData({ ...formData, parentId: value })}
                      options={[
                        { value: "", label: "Không có (danh mục gốc)" },
                        ...parentCategories
                          .filter((cat) => !isEditMode || cat.id !== categoryId)
                          .map((cat) => ({
                            value: cat.id.toString(),
                            label: cat.name,
                          })),
                      ]}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả danh mục..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value, 10) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Số nhỏ hiển thị trước (dùng để sắp xếp danh mục trên menu)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <Select
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    options={[
                      { value: "active", label: "Hoạt động" },
                      { value: "inactive", label: "Ngừng hoạt động" },
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-1">1 = Hoạt động, 0 = Ngừng hoạt động</p>
                </div>
              </div>
            )}

            {/* Tab Content: SEO */}
            {activeTab === "seo" && (
              <SEOFields
                value={{
                  metaTitle: formData.metaTitle,
                  metaDescription: formData.metaDescription,
                  metaKeywords: formData.metaKeywords,
                  metaRobots: formData.metaRobots,
                  canonicalUrl: formData.canonicalUrl,
                }}
                onChange={(seoData) => {
                  setFormData({
                    ...formData,
                    ...seoData,
                  });
                }}
                canonicalPlaceholder="https://example.com/category-slug"
                keywordsExample="danh mục, category, sản phẩm"
              />
            )}

            {/* Tab Content: List Products */}
            {activeTab === "products" && isEditMode && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danh sách sản phẩm ({productsTotal})
                  </h3>
                </div>

                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sản phẩm</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thương hiệu</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Giá</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tồn kho</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingProducts ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-gray-500">
                              Đang tải...
                            </td>
                          </tr>
                        ) : products.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-gray-500">
                              <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                              <p>Chưa có sản phẩm nào trong danh mục này</p>
                            </td>
                          </tr>
                        ) : (
                          products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img
                                      src={getImageUrl(product.thumbnailUrl)}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = "/no-image-available.png";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                    <div className="text-sm text-gray-500 line-clamp-1">{product.shortDescription}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{product.sku}</td>
                              <td className="py-4 px-4 text-gray-600">{product.brand || "-"}</td>
                              <td className="py-4 px-4">
                                <div className="text-gray-900 font-medium">{formatPrice(product.salePrice || product.price)}</div>
                                {product.salePrice && product.salePrice < product.price && (
                                  <div className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <span className={product.stockQuantity === 0 ? "text-red-600 font-medium" : product.stockQuantity < 10 ? "text-yellow-600 font-medium" : "text-gray-600"}>
                                  {product.stockQuantity}
                                </span>
                              </td>
                              <td className="py-4 px-4">{getStatusBadge(product.status)}</td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => router.push(`/admin/products/${product.id}`)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Sửa"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => window.open(`/${product.slug}.html`, '_blank')}
                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    title="Xem"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {productsTotalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        Hiển thị {((productsPage - 1) * 10) + 1}-{Math.min(productsPage * 10, productsTotal)} trong tổng số {productsTotal} sản phẩm
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                          disabled={productsPage === 1}
                        >
                          Trước
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(productsTotalPages, 5) }, (_, i) => {
                            let page;
                            if (productsTotalPages <= 5) {
                              page = i + 1;
                            } else if (productsPage <= 3) {
                              page = i + 1;
                            } else if (productsPage >= productsTotalPages - 2) {
                              page = productsTotalPages - 4 + i;
                            } else {
                              page = productsPage - 2 + i;
                            }
                            return (
                              <button
                                key={page}
                                onClick={() => setProductsPage(page)}
                                className={`
                                  px-3 py-1 rounded text-sm font-medium
                                  ${productsPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }
                                `}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setProductsPage((p) => Math.min(productsTotalPages, p + 1))}
                          disabled={productsPage === productsTotalPages}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
