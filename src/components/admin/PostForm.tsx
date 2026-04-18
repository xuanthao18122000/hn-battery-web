"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Save, Wand2, Pencil } from "lucide-react";
import { AdminPageHeader } from "./AdminPageHeader";
import { postsApi, Post, CreatePostDto, UpdatePostDto } from "@/lib/api/posts";
import { categoriesApi, CategoryTypeEnum } from "@/lib/api/categories";
import type { Category } from "@/lib/api/categories";
import { useRouter } from "next/navigation";
import SEOFields from "./SEOFields";
import { TextEditor } from "@/components/ui/text-editor";
import { FileUpload } from "@/components/ui/file-upload";

interface PostFormProps {
  postId?: number;
  initialData?: Post;
}

export default function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const isEditMode = !!postId;
  const [isLoading, setIsLoading] = useState(isEditMode && !initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");
  const [slugMode, setSlugMode] = useState<"auto" | "manual">("auto");
  const [postCategories, setPostCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    categoryId: "" as "" | number,
    status: "draft",
    featuredImage: "",
    // SEO fields
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaRobots: "index,follow",
    canonicalUrl: "",
  });

  // Slug mode: auto for new, manual for edit
  useEffect(() => {
    setSlugMode(isEditMode ? "manual" : "auto");
  }, [isEditMode]);

  // Lấy danh mục bài viết (type = POST) từ API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await categoriesApi.getList({
          type: CategoryTypeEnum.POST,
          status: 1,
          getFull: true,
        });
        if (!cancelled && res?.data) setPostCategories(res.data);
      } catch {
        if (!cancelled) setPostCategories([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load post data if editing
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title,
        slug: initialData.slug,
        shortDescription: initialData.shortDescription || "",
        content: initialData.content || "",
        categoryId: initialData.categoryId != null ? initialData.categoryId : "",
        status: initialData.status === 1 ? "published" : initialData.status === -1 ? "draft" : "archived",
        featuredImage: initialData.featuredImage || "",
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
        metaKeywords: initialData.metaKeywords || "",
        metaRobots: initialData.metaRobots || "index,follow",
        canonicalUrl: initialData.canonicalUrl || "",
      });
    } else if (isEditMode && postId) {
      loadPost();
    }
  }, [postId, initialData, isEditMode]);

  const loadPost = async () => {
    if (!postId) return;
    setIsLoading(true);
    try {
      const post = await postsApi.getById(postId);
      setFormData({
        title: post.title,
        slug: post.slug,
        shortDescription: post.shortDescription || "",
        content: post.content || "",
        categoryId: post.categoryId != null ? post.categoryId : "",
        status: post.status === 1 ? "published" : post.status === -1 ? "draft" : "archived",
        featuredImage: post.featuredImage || "",
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        metaKeywords: post.metaKeywords || "",
        metaRobots: post.metaRobots || "index,follow",
        canonicalUrl: post.canonicalUrl || "",
      });
    } catch (err: any) {
      setError("Không thể tải thông tin bài viết. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
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
      const slug = formData.slug || generateSlug(formData.title);

      // Convert status string to number
      const statusNumber =
        formData.status === "published" ? 1 : formData.status === "draft" ? -1 : 0;

      if (isEditMode && postId) {
        const updateData: UpdatePostDto = {
          title: formData.title,
          slug,
          shortDescription: formData.shortDescription || undefined,
          content: formData.content || undefined,
          categoryId: formData.categoryId !== "" ? Number(formData.categoryId) : undefined,
          status: statusNumber,
          featuredImage: formData.featuredImage || undefined,
          publishedAt: formData.status === "published" ? new Date().toISOString() : undefined,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          metaRobots: formData.metaRobots || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
        };
        await postsApi.update(postId, updateData);
      } else {
        const createData: CreatePostDto = {
          title: formData.title,
          slug,
          shortDescription: formData.shortDescription || undefined,
          content: formData.content || undefined,
          categoryId: formData.categoryId !== "" ? Number(formData.categoryId) : undefined,
          status: statusNumber,
          featuredImage: formData.featuredImage || undefined,
          publishedAt: formData.status === "published" ? new Date().toISOString() : undefined,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
          metaKeywords: formData.metaKeywords || undefined,
          metaRobots: formData.metaRobots || undefined,
          canonicalUrl: formData.canonicalUrl || undefined,
        };
        await postsApi.create(createData);
      }

      // Redirect to list page
      router.push("/admin/posts");
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể lưu bài viết. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClick = () => {
    const form = document.querySelector("form");
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
          title={isEditMode ? "Sửa bài viết" : "Viết bài mới"}
          backHref="/admin/posts"
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
                  : "Tạo bài viết"}
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
                      Tiêu đề *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setFormData({
                          ...formData,
                          title: newTitle,
                          slug: slugMode === "auto" ? generateSlug(newTitle) : formData.slug,
                        });
                      }}
                      placeholder="Nhập tiêu đề bài viết"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <div className="relative">
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="slug-bai-viet"
                        required
                        disabled={slugMode === "auto"}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSlugMode("auto");
                            setFormData({ ...formData, slug: generateSlug(formData.title) });
                          }}
                          className={`p-1.5 rounded transition-colors ${
                            slugMode === "auto"
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          }`}
                          title="Tự động tạo slug từ tiêu đề"
                        >
                          <Wand2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlugMode("manual")}
                          className={`p-1.5 rounded transition-colors ${
                            slugMode === "manual"
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          }`}
                          title="Nhập slug thủ công"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {slugMode === "auto"
                        ? "Tự động tạo từ tiêu đề"
                        : "Nhập slug thủ công"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả ngắn
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, shortDescription: e.target.value })
                    }
                    placeholder="Tóm tắt ngắn gọn về bài viết (hiển thị ở danh sách, thẻ bài viết)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <Select
                      value={formData.categoryId === "" ? "" : String(formData.categoryId)}
                      onChange={(value) => setFormData({ ...formData, categoryId: value === "" ? "" : Number(value) })}
                      options={[
                        { value: "", label: "Chọn danh mục" },
                        ...postCategories.map((cat) => ({ value: String(cat.id), label: cat.name })),
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <Select
                      value={formData.status}
                      onChange={(value) => setFormData({ ...formData, status: value })}
                      options={[
                        { value: "draft", label: "Bản nháp" },
                        { value: "published", label: "Xuất bản" },
                        { value: "archived", label: "Lưu trữ" },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <FileUpload
                    label="Ảnh đại diện"
                    value={formData.featuredImage}
                    onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                    object="products"
                    objectId={postId?.toString() || "0"}
                    accept="image/*"
                    maxSize={5 * 1024 * 1024}
                    helperText="Upload ảnh đại diện cho bài viết (PNG, JPG, GIF tối đa 5MB)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                  <TextEditor
                    value={formData.content}
                    onChange={(content: string) => setFormData({ ...formData, content })}
                    placeholder="Nhập nội dung bài viết..."
                    height={500}
                    uploadObjectId={postId || 0}
                    uploadObjectType="products"
                    preset="full"
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
                canonicalPlaceholder="https://example.com/post-slug"
                keywordsExample="bài viết, tin tức, hướng dẫn"
              />
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
