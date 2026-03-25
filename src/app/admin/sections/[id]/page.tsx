"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Save,
  Trash2,
  Plus,
  Search,
  X,
  GripVertical,
  Wand2,
  Pencil,
  ArrowUpDown,
  Check,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  sectionsApi,
  Section,
  SectionDataSourceEnum,
  SectionItem,
  SectionTypeEnum,
  StatusCommonEnum,
} from "@/lib/api/sections";
import { productsApi, Product } from "@/lib/api/products";
import { formatPrice } from "@/utils/format";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";

function getErrorMessage(error: unknown, fallback: string) {
  const response = (error as { response?: { data?: { message?: string | string[] } } })?.response;
  const message = response?.data?.message;
  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }
  return message ?? fallback;
}

export default function EditSectionPage() {
  const params = useParams();
  const id = Number(params.id);
  const [section, setSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [codeMode, setCodeMode] = useState<"auto" | "manual">("manual");
  const [formData, setFormData] = useState({
    type: SectionTypeEnum.PRODUCT as 1 | 2,
    dataSource: SectionDataSourceEnum.MANUAL as 1 | 2,
    productRows: 1,
    name: "",
    code: "",
    page: "home",
    position: 0,
    status: 1 as 1 | -1,
  });

  const generateCode = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const [showAddModal, setShowAddModal] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [addingSelected, setAddingSelected] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [newItemPosition, setNewItemPosition] = useState(0);
  const [sortItemMode, setSortItemMode] = useState(false);
  const [localItemOrder, setLocalItemOrder] = useState<number[]>([]);
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null);
  const [isSavingItemOrder, setIsSavingItemOrder] = useState(false);

  const fetchSection = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await sectionsApi.getById(id);
      setSection(data);
      setFormData({
        type: (data.type ?? SectionTypeEnum.PRODUCT) as 1 | 2,
        dataSource:
          (data.dataSource ??
            ((data.type ?? SectionTypeEnum.PRODUCT) === SectionTypeEnum.POST
              ? SectionDataSourceEnum.LATEST
              : SectionDataSourceEnum.MANUAL)) as 1 | 2,
        productRows: data.productRows ?? 2,
        name: data.name,
        code: data.code,
        page: data.page || "home",
        position: data.position ?? 0,
        status: (data.status ?? StatusCommonEnum.ACTIVE) as 1 | -1,
      });
      setCodeMode("manual");
    } catch (error: unknown) {
      setError("Không thể tải block.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchSection();
  }, [id, fetchSection]);

  useEffect(() => {
    if (
      sortItemMode &&
      section?.items?.length &&
      localItemOrder.length !== section.items.length
    ) {
      setLocalItemOrder(
        [...(section.items || [])].sort((a, b) => a.position - b.position).map((i) => i.id)
      );
    }
  }, [sortItemMode, localItemOrder.length, section?.items]);

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    setError("");
    try {
      await sectionsApi.update(id, formData);
      fetchSection();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Không thể lưu block."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveItem = async (item: SectionItem) => {
    if (!id) return;
    if (!confirm("Gỡ sản phẩm này khỏi block?")) return;
    try {
      await sectionsApi.removeItem(id, item.id);
      fetchSection();
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Không thể gỡ sản phẩm."));
    }
  };

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
    loadProducts(); // 10 items mặc định
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setProductSearch("");
    setProductResults([]);
    setSelectedProductIds(new Set());
  };

  const toggleProductSelection = (productId: number) => {
    if (isProductInSection(productId)) return;
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleAddSelected = async () => {
    if (!id || selectedProductIds.size === 0) return;
    const toAdd = [...selectedProductIds].filter((pid) => !isProductInSection(pid));
    if (toAdd.length === 0) return;
    setAddingSelected(true);
    try {
      let pos = newItemPosition;
      for (const productId of toAdd) {
        await sectionsApi.addItem(id, { refId: productId, position: pos });
        pos += 1;
      }
      closeAddModal();
      setNewItemPosition(0);
      fetchSection();
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Không thể thêm sản phẩm."));
    } finally {
      setAddingSelected(false);
    }
  };

  const isProductInSection = (productId: number) => {
    return section?.items?.some((i) => i.refId === productId);
  };

  const sortedItems = [...(section?.items || [])].sort((a, b) => a.position - b.position);

  const currentType = formData.type ?? (section?.type ?? SectionTypeEnum.PRODUCT);
  const currentDataSource =
    formData.dataSource ??
    (section?.dataSource ??
      (currentType === SectionTypeEnum.POST
        ? SectionDataSourceEnum.LATEST
        : SectionDataSourceEnum.MANUAL));
  const isManualProductBlock =
    currentType === SectionTypeEnum.PRODUCT &&
    currentDataSource === SectionDataSourceEnum.MANUAL;
  const isLatestSection = currentDataSource === SectionDataSourceEnum.LATEST;

  const itemsToShow =
    sortItemMode && localItemOrder.length > 0
      ? (localItemOrder
          .map((id) => section?.items?.find((i) => i.id === id))
          .filter(Boolean) as SectionItem[])
      : sortedItems;

  const enterSortItemMode = () => {
    setSortItemMode(true);
    setLocalItemOrder(sortedItems.map((i) => i.id));
  };

  const handleSaveItemOrder = async () => {
    if (!id || localItemOrder.length === 0) return;
    setIsSavingItemOrder(true);
    try {
      await Promise.all(
        localItemOrder.map((itemId, index) =>
          sectionsApi.updateItemPosition(id, itemId, index)
        )
      );
      await fetchSection();
      setSortItemMode(false);
      setLocalItemOrder([]);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Không thể lưu thứ tự."));
    } finally {
      setIsSavingItemOrder(false);
    }
  };

  const handleDragStartItem = (e: React.DragEvent, itemId: number) => {
    setDraggingItemId(itemId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(itemId));
    const li = (e.currentTarget as HTMLElement).closest("li");
    if (li) e.dataTransfer.setDragImage(li, 0, 0);
  };

  const handleDragEndItem = () => setDraggingItemId(null);

  const handleDragOverItem = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropItem = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!sortItemMode) return;
    const itemIdStr = e.dataTransfer.getData("text/plain");
    if (!itemIdStr) return;
    const dragItemId = Number(itemIdStr);
    const dragIndex = localItemOrder.indexOf(dragItemId);
    if (dragIndex === -1 || dragIndex === dropIndex) return;

    const next = [...localItemOrder];
    const [removed] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, removed);
    setLocalItemOrder(next);
    setDraggingItemId(null);
  };

  const moveItemUp = (index: number) => {
    if (index <= 0) return;
    const next = [...localItemOrder];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setLocalItemOrder(next);
  };

  const moveItemDown = (index: number) => {
    if (index >= localItemOrder.length - 1) return;
    const next = [...localItemOrder];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setLocalItemOrder(next);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="p-6">
        <p className="text-red-600">Không tìm thấy block.</p>
        <Link href="/admin/sections">
          <Button variant="outline" className="mt-2">
            Quay lại
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <AdminPageHeader
        title={`Sửa block: ${section.name}`}
        backHref="/admin/sections"
        actions={
          <Button
            type="submit"
            form="form-section"
            variant="default"
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Card className="p-6">
          <form id="form-section" onSubmit={handleSaveSection} className="space-y-4">
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
                    code:
                      codeMode === "auto" ? generateCode(name) : formData.code,
                  });
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <div className="relative">
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
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
                Loại block
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const type = Number(e.target.value) as 1 | 2;
                  setFormData({
                    ...formData,
                    type,
                    dataSource:
                      type === SectionTypeEnum.POST
                        ? SectionDataSourceEnum.LATEST
                        : formData.dataSource === SectionDataSourceEnum.LATEST
                          ? SectionDataSourceEnum.LATEST
                          : SectionDataSourceEnum.MANUAL,
                  });
                }}
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
                value={formData.dataSource}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dataSource: Number(e.target.value) as 1 | 2,
                  })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              >
                {formData.type === SectionTypeEnum.PRODUCT && (
                  <option value={SectionDataSourceEnum.MANUAL}>Chọn tay</option>
                )}
                <option value={SectionDataSourceEnum.LATEST}>Mới nhất</option>
              </select>
            </div>
            {formData.type === SectionTypeEnum.PRODUCT && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số hàng sản phẩm
                </label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.productRows}
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
                Vị trí block
              </label>
              <Input
                type="number"
                min={0}
                value={formData.position}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
            </div>
          </form>
        </Card>

        {isManualProductBlock && (
        <Card className="p-6">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <h2 className="text-lg font-semibold text-gray-900">
              Sản phẩm trong block ({section.items?.length ?? 0})
            </h2>
            <div className="flex items-center gap-2">
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
              {section.items?.length ? (
                sortItemMode ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1"
                      onClick={handleSaveItemOrder}
                      disabled={isSavingItemOrder}
                    >
                      <Check className="w-4 h-4" />
                      {isSavingItemOrder ? "Đang lưu..." : "Lưu thứ tự"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        setSortItemMode(false);
                        setLocalItemOrder([]);
                      }}
                    >
                      Xong
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={enterSortItemMode}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Sắp xếp
                  </Button>
                )
              ) : null}
            </div>
          </div>
          {!section.items?.length ? (
            <p className="text-gray-500 text-sm">
              Chưa có sản phẩm. Bấm &quot;Thêm sản phẩm&quot; để chọn.
            </p>
          ) : (
            <ul className="space-y-2">
              {itemsToShow.map((item, index) => (
                <li
                  key={item.id}
                  {...(sortItemMode && {
                    onDragOver: handleDragOverItem,
                    onDrop: (e: React.DragEvent) => handleDropItem(e, index),
                  })}
                  className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg ${
                    sortItemMode ? "bg-blue-50/30" : ""
                  } ${draggingItemId === item.id ? "opacity-50" : ""} ${
                    isSavingItemOrder ? "pointer-events-none" : ""
                  }`}
                >
                  {sortItemMode ? (
                    <span className="text-gray-400 shrink-0 cursor-grab active:cursor-grabbing touch-none">
                      <div
                        draggable
                        role="button"
                        tabIndex={0}
                        className="inline-flex"
                        onDragStart={(e) => handleDragStartItem(e, item.id)}
                        onDragEnd={handleDragEndItem}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") e.preventDefault();
                        }}
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                    </span>
                  ) : (
                    <span className="text-gray-400 shrink-0 opacity-50">
                      <GripVertical className="w-4 h-4" />
                    </span>
                  )}
                  <span className="text-sm text-gray-500 w-8 shrink-0">
                    {sortItemMode ? index : item.position}
                  </span>
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                      {item.product?.thumbnailUrl ? (
                        <img
                          src={`${CDN_URL}/${item.product.thumbnailUrl}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.product?.name ?? `SP #${item.refId}`}
                      </p>
                      {item.product != null && (
                        <p className="text-sm text-gray-600">
                          {item.product.salePrice != null
                            ? formatPrice(item.product.salePrice)
                            : formatPrice(item.product.price)}
                          {item.product.salePrice != null &&
                            item.product.salePrice !== item.product.price && (
                              <span className="text-gray-400 line-through ml-1">
                                {formatPrice(item.product.price)}
                              </span>
                            )}
                        </p>
                      )}
                    </div>
                    {sortItemMode ? (
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === 0}
                          onClick={() => moveItemUp(index)}
                          title="Lên"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === itemsToShow.length - 1}
                          onClick={() => moveItemDown(index)}
                          title="Xuống"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
            </ul>
          )}
        </Card>
        )}

        {!isManualProductBlock && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Xem trước dữ liệu block
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {currentType === SectionTypeEnum.POST
                ? isLatestSection
                  ? "Block này đang lấy các bài viết mới nhất theo giới hạn đã cấu hình."
                  : "Block bài viết đang dùng dữ liệu chọn tay."
                : isLatestSection
                  ? "Block này đang lấy các sản phẩm mới nhất theo giới hạn đã cấu hình."
                  : "Block này không dùng chế độ thêm sản phẩm thủ công."}
            </p>
            {!section.items?.length ? (
              <p className="text-sm text-gray-500">Chưa có dữ liệu xem trước.</p>
            ) : (
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li
                    key={`${item.id}-${item.refId}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-gray-900">
                      {item.post?.title ?? item.product?.name ?? `Item #${item.refId}`}
                    </span>
                    <span className="shrink-0 text-xs text-gray-500">
                      #{item.position}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-semibold">Thêm sản phẩm vào block</h3>
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
                      e.key === "Enter" && (e.preventDefault(), loadProducts(productSearch || undefined))
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
                    const inSection = isProductInSection(p.id);
                    const selected = selectedProductIds.has(p.id);
                    return (
                      <li
                        key={p.id}
                        className={`flex items-center gap-3 p-2 border rounded-lg ${
                          inSection ? "bg-gray-50 border-gray-100" : "border-gray-100 hover:bg-gray-50"
                        }`}
                      >
                        <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={inSection}
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
                          {inSection && (
                            <span className="text-xs text-gray-500 shrink-0">
                              Đã có trong block
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
                disabled={selectedProductIds.size === 0 || addingSelected}
                onClick={handleAddSelected}
              >
                {addingSelected
                  ? "Đang thêm..."
                  : `Thêm đã chọn (${selectedProductIds.size})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
