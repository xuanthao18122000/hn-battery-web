"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Save, Wand2, Pencil } from "lucide-react";
import { AdminPageHeader } from "./AdminPageHeader";
import { productsApi, Product, CreateProductDto, UpdateProductDto } from "@/lib/api/products";
import { categoriesApi, Category } from "@/lib/api/categories";
import { useRouter } from "next/navigation";
import SEOFields from "./SEOFields";
import { SelectMultiple } from "@/components/ui/select-multiple";
import { FileUpload } from "@/components/ui/file-upload";
import { TextEditor } from "@/components/ui/text-editor";

interface ProductFormProps {
  productId?: number;
  initialData?: Product;
}

export default function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [slugMode, setSlugMode] = useState<"auto" | "manual">("auto");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    price: "",
    salePrice: "",
    stockQuantity: "",
    status: "active",
    shortDescription: "",
    description: "",
    thumbnailUrl: "",
    brand: "",
    categoryIds: [] as number[],
    showPrice: true,
    // SEO fields
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaRobots: "index,follow",
    canonicalUrl: "",
  });

  const isEditMode = !!productId;

  // Set slug mode: auto for new, manual for edit
  useEffect(() => {
    if (isEditMode) {
      setSlugMode("manual");
    } else {
      setSlugMode("auto");
    }
  }, [isEditMode]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await categoriesApi.getList({ getFull: true });
      setCategories(response.data || []);
    } catch {} finally {
      setLoadingCategories(false);
    }
  };

  // Load product data if editing
  useEffect(() => {
    if (isEditMode && initialData) {
      // Extract category IDs from productCategories
      const categoryIds = (initialData as any).productCategories?.map(
        (pc: any) => pc.categoryId || pc.category?.id
      ).filter((id: number) => id) || [];
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        sku: initialData.sku,
        price: initialData.price.toString(),
        salePrice: initialData.salePrice?.toString() || "",
        stockQuantity: initialData.stockQuantity.toString(),
        status: initialData.status,
        shortDescription: initialData.shortDescription || "",
        description: initialData.description || "",
        thumbnailUrl: initialData.thumbnailUrl || "",
        brand: initialData.brand || "",
        categoryIds,
        showPrice: (initialData as any).showPrice !== false,
        metaTitle: (initialData as any).metaTitle || "",
        metaDescription: (initialData as any).metaDescription || "",
        metaKeywords: (initialData as any).metaKeywords || "",
        metaRobots: (initialData as any).metaRobots || "index,follow",
        canonicalUrl: (initialData as any).canonicalUrl || "",
      });
    } else if (isEditMode && productId) {
      loadProduct();
    }
  }, [productId, initialData, isEditMode]);

  const loadProduct = async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const product = await productsApi.getById(productId);
      // Extract category IDs from productCategories
      const categoryIds = (product as any).productCategories?.map(
        (pc: any) => pc.categoryId || pc.category?.id
      ).filter((id: number) => id) || [];
      setFormData({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        price: product.price.toString(),
        salePrice: product.salePrice?.toString() || "",
        stockQuantity: product.stockQuantity.toString(),
        status: product.status,
        shortDescription: product.shortDescription || "",
        description: (product as any).description || "",
        thumbnailUrl: product.thumbnailUrl || "",
        brand: product.brand || "",
        categoryIds,
        showPrice: (product as any).showPrice !== false,
        metaTitle: (product as any).metaTitle || "",
        metaDescription: (product as any).metaDescription || "",
        metaKeywords: (product as any).metaKeywords || "",
        metaRobots: (product as any).metaRobots || "index,follow",
        canonicalUrl: (product as any).canonicalUrl || "",
      });
    } catch (err: any) {
      setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
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

      if (isEditMode && productId) {
        const updateData: UpdateProductDto = {
          name: formData.name,
          slug,
          sku: formData.sku,
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
          stockQuantity: parseInt(formData.stockQuantity),
          status: formData.status,
          shortDescription: formData.shortDescription || undefined,
          description: formData.description || undefined,
          thumbnailUrl: formData.thumbnailUrl || undefined,
          brand: formData.brand || undefined,
          categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
          showPrice: formData.showPrice,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          metaRobots: formData.metaRobots || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
        };
        await productsApi.update(productId, updateData);
      } else {
        const createData: CreateProductDto = {
          name: formData.name,
          slug,
          sku: formData.sku,
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
          stockQuantity: parseInt(formData.stockQuantity),
          status: formData.status,
          shortDescription: formData.shortDescription || undefined,
          description: formData.description || undefined,
          thumbnailUrl: formData.thumbnailUrl || undefined,
          brand: formData.brand || undefined,
          categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
          showPrice: formData.showPrice,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          metaRobots: formData.metaRobots || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
        };
        await productsApi.create(createData);
      }

      // Redirect to list page
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể lưu sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

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
          title={isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          backHref="/admin/products"
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
                  : "Thêm sản phẩm"}
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
              </nav>
            </div>

            {/* Tab Content: Thông tin chung */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm *
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
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <div className="relative">
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="vd: iphone-15-pro-max"
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
                    ? "Tự động tạo từ tên sản phẩm" 
                    : "Nhập slug thủ công"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Nhập SKU"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Nhập thương hiệu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <Select
                  value={formData.status}
                  onChange={(value) => setFormData({ ...formData, status: value })}
                  options={[
                    { value: "active", label: "Đang bán" },
                    { value: "inactive", label: "Ngừng bán" },
                    { value: "out_of_stock", label: "Hết hàng" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho *</label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="0"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá khuyến mãi</label>
                <Input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showPrice"
                checked={formData.showPrice}
                onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="showPrice" className="text-sm font-medium text-gray-700">
                Hiển thị giá sản phẩm (bỏ chọn = hiện &quot;Liên hệ&quot;)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              {loadingCategories ? (
                <div className="text-sm text-gray-500">Đang tải danh mục...</div>
              ) : (
                <SelectMultiple
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  value={formData.categoryIds}
                  onChange={(selectedIds) => {
                    setFormData({
                      ...formData,
                      categoryIds: selectedIds as number[],
                    });
                  }}
                  placeholder="Chọn danh mục..."
                />
              )}
              {formData.categoryIds.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Đã chọn {formData.categoryIds.length} danh mục
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Nhập mô tả ngắn sản phẩm..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả dài</label>
              <TextEditor
                value={formData.description}
                onChange={(content: string) => setFormData({ ...formData, description: content })}
                placeholder="Nhập mô tả chi tiết sản phẩm (HTML)..."
                uploadObjectId={productId || 0}
                uploadObjectType="products"
              />
            </div>

                <div>
                  <FileUpload
                    label="Ảnh đại diện sản phẩm"
                    value={formData.thumbnailUrl}
                    onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                    object="products"
                    objectId={productId?.toString() || "0"}
                    accept="image/*"
                    maxSize={5 * 1024 * 1024}
                    helperText="Upload ảnh đại diện cho sản phẩm (PNG, JPG, GIF tối đa 5MB)"
                  />
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
                canonicalPlaceholder="https://example.com/product-slug"
                keywordsExample="iphone, điện thoại, apple"
              />
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
