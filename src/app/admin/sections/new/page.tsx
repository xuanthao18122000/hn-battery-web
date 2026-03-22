"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Wand2, Pencil, Plus, Search, X, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  sectionsApi,
  CreateSectionDto,
  SectionDataSourceEnum,
  SectionTypeEnum,
  StatusCommonEnum,
} from "@/lib/api/sections";
import { productsApi, Product } from "@/lib/api/products";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function getErrorMessage(error: unknown, fallback: string) {
  const response = (error as { response?: { data?: { message?: string | string[] } } })?.response;
  const message = response?.data?.message;
  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }
  return message ?? fallback;
}

export default function NewSectionPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [codeMode, setCodeMode] = useState<"auto" | "manual">("auto");
  const [formData, setFormData] = useState<CreateSectionDto>({
    type: SectionTypeEnum.PRODUCT,
    dataSource: SectionDataSourceEnum.MANUAL,
    productRows: 1,
    name: "",
    code: "",
    page: "home",
    position: 0,
    status: 1,
  });

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());

  const isManualProductBlock =
    (formData.type ?? SectionTypeEnum.PRODUCT) === SectionTypeEnum.PRODUCT &&
    (formData.dataSource ?? SectionDataSourceEnum.MANUAL) === SectionDataSourceEnum.MANUAL;

  const loadProducts = async (name?: string) => {
    setSearchingProducts(true);
    try {
      const res = await productsApi.getList({
        page: 1,
        limit: 10,
        name: name || undefined,
      });
      const list = res?.data ?? [];
      setProductResults(Array.isArray(list) ? list : []);
    } catch {
      setProductResults([]);
    } finally {
      setSearchingProducts(false);
    }
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setProductSearch("");
    setSelectedProductIds(new Set());
    loadProducts();
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setProductSearch("");
    setProductResults([]);
    setSelectedProductIds(new Set());
  };

  const isProductInSelected = (productId: number) =>
    selectedProducts.some((p) => p.id === productId);

  const toggleProductSelection = (productId: number) => {
    if (isProductInSelected(productId)) return;
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleAddSelectedToForm = () => {
    const toAdd = productResults.filter(
      (p) => selectedProductIds.has(p.id) && !isProductInSelected(p.id)
    );
    if (toAdd.length === 0) {
      closeAddModal();
      return;
    }
    setSelectedProducts((prev) => [...prev, ...toAdd]);
    closeAddModal();
  };

  const removeProductFromList = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const generateCode = (name: string) => {
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
      const section = await sectionsApi.create(formData);
      if (isManualProductBlock && selectedProducts.length > 0) {
        for (let i = 0; i < selectedProducts.length; i++) {
          await sectionsApi.addItem(section.id, {
            refId: selectedProducts[i].id,
            position: i,
          });
        }
      }
      router.push(`/admin/sections/${section.id}`);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Không thể tạo block."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full p-6">
      <AdminPageHeader
        title="Thêm block mới"
        backHref="/admin/sections"
        actions={
          <Button
            type="submit"
            form="form-new-section"
            variant="default"
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Đang lưu..." : "Tạo block"}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <Card className="w-full max-w-none p-6">
        <form id="form-new-section" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại block
            </label>
            <select
              value={formData.type ?? SectionTypeEnum.PRODUCT}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: Number(e.target.value) as 1 | 2,
                  dataSource:
                    Number(e.target.value) === SectionTypeEnum.POST
                      ? SectionDataSourceEnum.LATEST
                      : SectionDataSourceEnum.MANUAL,
                })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
            >
              <option value={SectionTypeEnum.PRODUCT}>Sản phẩm</option>
              <option value={SectionTypeEnum.POST}>Bài viết</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nguồn dữ liệu
            </label>
            <select
              value={formData.dataSource ?? SectionDataSourceEnum.MANUAL}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataSource: Number(e.target.value) as 1 | 2,
                })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
            >
              {(formData.type ?? SectionTypeEnum.PRODUCT) === SectionTypeEnum.PRODUCT && (
                <option value={SectionDataSourceEnum.MANUAL}>Chọn tay</option>
              )}
              <option value={SectionDataSourceEnum.LATEST}>Mới nhất</option>
            </select>
          </div>
          {(formData.type ?? SectionTypeEnum.PRODUCT) === SectionTypeEnum.PRODUCT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số hàng sản phẩm
              </label>
              <Input
                type="number"
                min={1}
                max={5}
                value={formData.productRows ?? 2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productRows: Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 2)),
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">1 hàng = 5 sản phẩm. Số hàng hiển thị trên trang chủ (1–5)</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên block *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  code: codeMode === "auto" ? generateCode(name) : formData.code,
                });
              }}
              placeholder="vd: TOP Sản Phẩm Ắc Quy Bán Chạy"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Redirect URL *
            </label>
            <div className="relative">
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="vd: top-ban-chay"
                required
                disabled={codeMode === "auto"}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCodeMode("auto");
                    setFormData({
                      ...formData,
                      code: generateCode(formData.name),
                    });
                  }}
                  className={
                    codeMode === "auto"
                      ? "p-1.5 rounded bg-blue-100 text-blue-600"
                      : "p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }
                  title="Tự động tạo code từ tên"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCodeMode("manual")}
                  className={
                    codeMode === "manual"
                      ? "p-1.5 rounded bg-blue-100 text-blue-600"
                      : "p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  }
                  title="Nhập thủ công"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {codeMode === "auto"
                ? "Tự động tạo từ tên block"
                : "Nhập code thủ công"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trang
            </label>
            <select
              value={formData.page}
              onChange={(e) =>
                setFormData({ ...formData, page: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="home">Trang chủ (home)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={formData.status ?? StatusCommonEnum.ACTIVE}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: Number(e.target.value) as 1 | -1,
                })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
            >
              <option value={StatusCommonEnum.ACTIVE}>Bật</option>
              <option value={StatusCommonEnum.INACTIVE}>Tắt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vị trí
            </label>
            <Input
              type="number"
              min={0}
              value={formData.position ?? 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  position: parseInt(e.target.value, 10) || 0,
                })
              }
            />
          </div>

          {isManualProductBlock && (
            <Card className="p-4 border border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Sản phẩm trong block ({selectedProducts.length})
                </h2>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="gap-1"
                  onClick={openAddModal}
                >
                  <Plus className="w-4 h-4" />
                  Thêm sản phẩm
                </Button>
              </div>
              {selectedProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Chưa có sản phẩm. Bấm &quot;Thêm sản phẩm&quot; để chọn.
                </p>
              ) : (
                <ul className="space-y-2">
                  {selectedProducts.map((p, index) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                    >
                      <span className="text-sm text-gray-500 w-6 shrink-0">
                        {index + 1}
                      </span>
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                        {p.thumbnailUrl ? (
                          <img
                            src={`${CDN_URL}/${p.thumbnailUrl}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {p.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {p.salePrice != null
                            ? formatPrice(p.salePrice)
                            : formatPrice(p.price)}
                          {p.salePrice != null &&
                            p.salePrice !== p.price && (
                              <span className="text-gray-400 line-through ml-1">
                                {formatPrice(p.price)}
                              </span>
                            )}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 shrink-0"
                        onClick={() => removeProductFromList(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

        </form>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold">Chọn sản phẩm thêm vào block</h3>
              <button
                type="button"
                onClick={closeAddModal}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-200 shrink-0">
              <div className="flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs text-gray-500 mb-1">Tìm theo tên</label>
                  <Input
                    placeholder="Tên sản phẩm..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), loadProducts(productSearch || undefined))
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loadProducts(productSearch || undefined)}
                  disabled={searchingProducts}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1 min-h-0">
              {searchingProducts && productResults.length === 0 ? (
                <p className="text-gray-500 text-sm">Đang tải...</p>
              ) : productResults.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Không có sản phẩm. Thử bỏ bớt từ khóa tìm kiếm.
                </p>
              ) : (
                <ul className="space-y-2">
                  {productResults.map((p) => {
                    const inList = isProductInSelected(p.id);
                    const selected = selectedProductIds.has(p.id);
                    return (
                      <li
                        key={p.id}
                        className={`flex items-center gap-3 p-2 border rounded-lg ${
                          inList
                            ? "bg-gray-50 border-gray-100"
                            : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={inList}
                            onChange={() => toggleProductSelection(p.id)}
                            className="rounded border-gray-300 shrink-0"
                          />
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                            {p.thumbnailUrl ? (
                              <img
                                src={`${CDN_URL}/${p.thumbnailUrl}`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {p.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {p.salePrice != null
                                ? formatPrice(p.salePrice)
                                : formatPrice(p.price)}
                              {p.salePrice != null &&
                                p.salePrice !== p.price && (
                                  <span className="text-gray-400 line-through ml-1">
                                    {formatPrice(p.price)}
                                  </span>
                                )}
                            </p>
                          </div>
                          {inList && (
                            <span className="text-xs text-gray-500 shrink-0">
                              Đã thêm
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 shrink-0">
              <Button type="button" variant="outline" onClick={closeAddModal}>
                Hủy
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={selectedProductIds.size === 0}
                onClick={handleAddSelectedToForm}
              >
                Thêm đã chọn ({selectedProductIds.size})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
