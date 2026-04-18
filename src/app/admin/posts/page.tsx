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
  Eye,
  FileText,
  Calendar,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { postsApi, Post } from "@/lib/api/posts";
import { categoriesApi, CategoryTypeEnum } from "@/lib/api/categories";
import { AdminPageHeader, Pagination, TableSkeleton } from "@/components/admin";
import { ConfirmModal } from "@/components/ui/confirm-modal";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn-v2.didongviet.vn";

const mockPosts = [
  {
    id: 1,
    title: "Hướng dẫn chọn ắc quy phù hợp cho xe máy",
    slug: "huong-dan-chon-ac-quy-phu-hop-cho-xe-may",
    excerpt: "Bài viết hướng dẫn chi tiết cách chọn ắc quy phù hợp với từng loại xe máy...",
    content: "Nội dung đầy đủ của bài viết...",
    author: "Admin",
    category: "Kinh nghiệm hay",
    status: "published",
    featuredImage: "https://via.placeholder.com/400x250",
    views: 1250,
    createdAt: "2024-01-15",
    publishedAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Cách bảo quản ắc quy đúng cách",
    slug: "cach-bao-quan-ac-quy-dung-cach",
    excerpt: "Những mẹo hay giúp kéo dài tuổi thọ ắc quy...",
    content: "Nội dung đầy đủ của bài viết...",
    author: "Admin",
    category: "Kinh nghiệm hay",
    status: "published",
    featuredImage: "https://via.placeholder.com/400x250",
    views: 890,
    createdAt: "2024-01-14",
    publishedAt: "2024-01-14",
  },
  {
    id: 3,
    title: "So sánh các thương hiệu ắc quy phổ biến",
    slug: "so-sanh-cac-thuong-hieu-ac-quy-pho-bien",
    excerpt: "Đánh giá chi tiết về các thương hiệu ắc quy hàng đầu...",
    content: "Nội dung đầy đủ của bài viết...",
    author: "Admin",
    category: "Tin tức",
    status: "draft",
    featuredImage: "https://via.placeholder.com/400x250",
    views: 0,
    createdAt: "2024-01-13",
    publishedAt: null,
  },
  {
    id: 4,
    title: "Dấu hiệu ắc quy sắp hết và cách xử lý",
    slug: "dau-hieu-ac-quy-sap-het-va-cach-xu-ly",
    excerpt: "Nhận biết sớm các dấu hiệu ắc quy yếu để thay thế kịp thời...",
    content: "Nội dung đầy đủ của bài viết...",
    author: "Admin",
    category: "Kinh nghiệm hay",
    status: "published",
    featuredImage: "https://via.placeholder.com/400x250",
    views: 2100,
    createdAt: "2024-01-12",
    publishedAt: "2024-01-12",
  },
  {
    id: 5,
    title: "Khuyến mãi tháng 1 - Giảm giá 20%",
    slug: "khuyen-mai-thang-1-giam-gia-20",
    excerpt: "Chương trình khuyến mãi đặc biệt trong tháng 1...",
    content: "Nội dung đầy đủ của bài viết...",
    author: "Admin",
    category: "Tin tức",
    status: "published",
    featuredImage: "https://via.placeholder.com/400x250",
    views: 3500,
    createdAt: "2024-01-11",
    publishedAt: "2024-01-11",
  },
];

type DisplayPost = Omit<Post, 'status' | 'author' | 'category'> & {
  status: string;
  author: string;
  categoryId?: number;
  category?: { id: number; name: string; slug: string };
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    published: { label: "Đã xuất bản", color: "bg-green-100 text-green-800" },
    draft: { label: "Bản nháp", color: "bg-yellow-100 text-yellow-800" },
    archived: { label: "Đã lưu trữ", color: "bg-gray-100 text-gray-800" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function PostsPage() {
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategories, setFilterCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<"all" | number>("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMockData, setIsMockData] = useState(false);
  const itemsPerPage = 10;
  const fetchingRef = useRef(false);

  const fetchPosts = useCallback(async () => {
    if (fetchingRef.current) return; // Prevent duplicate calls
    fetchingRef.current = true;
    
    setIsLoading(true);
    setError("");
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchTerm) {
        params.title = searchTerm;
      }

      if (selectedStatus !== "all") {
        params.status = selectedStatus === "published" ? 1 : -1;
      }

      if (selectedCategoryId !== "all") {
        params.categoryId = selectedCategoryId;
      }

      const response = await postsApi.getList(params);

      // Transform API data to match DisplayPost format
      const transformedPosts: DisplayPost[] = response.data.map((post) => ({
        ...post,
        categoryId: post.categoryId,
        category: post.category,
        author: post.author?.fullName || "Admin",
        status: post.status === 1 ? "published" : post.status === -1 ? "draft" : "archived",
        createdAt: post.createdAt ? new Date(post.createdAt).toISOString().split("T")[0] : "",
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : undefined,
      }));

      setPosts(transformedPosts);
      const apiTotal = response.total ?? transformedPosts.length;
      setTotal(apiTotal);
      setTotalPages(
        response.totalPages ?? Math.max(1, Math.ceil(apiTotal / itemsPerPage)),
      );
      setIsMockData(false);
    } catch (err: any) {
      setError("Không thể tải danh sách bài viết. Đang sử dụng dữ liệu mẫu.");
      // Fallback to mockup data on error (gán type mặc định)
      setPosts(mockPosts as any);
      setTotal(mockPosts.length);
      setTotalPages(Math.max(1, Math.ceil(mockPosts.length / itemsPerPage)));
      setIsMockData(true);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [currentPage, searchTerm, selectedStatus, selectedCategoryId, itemsPerPage]);

  // Load danh mục bài viết cho filter
  useEffect(() => {
    (async () => {
      try {
        const res = await categoriesApi.getList({
          type: CategoryTypeEnum.POST,
          status: 1,
          getFull: true,
        });
        if (res?.data) setFilterCategories(res.data.map((c) => ({ id: c.id, name: c.name })));
      } catch {
        setFilterCategories([]);
      }
    })();
  }, []);

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Use API data if available, otherwise use mockup
  const displayPosts = posts.length > 0 ? posts : mockPosts;

  // Khi dùng mock (API fail), filter + paginate phía client.
  // Khi dùng API, server đã filter + paginate — chỉ render list nhận được.
  const paginatedPosts = isMockData
    ? displayPosts
        .filter((post) => {
          const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.slug.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory =
            selectedCategoryId === "all" ||
            (post as DisplayPost).categoryId === selectedCategoryId;
          const matchesStatus =
            selectedStatus === "all" || post.status === selectedStatus;
          return matchesSearch && matchesCategory && matchesStatus;
        })
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : displayPosts;

  // Stats
  const stats = {
    total: displayPosts.length,
    published: displayPosts.filter((p: any) => p.status === "published" || p.status === 1).length,
    draft: displayPosts.filter((p: any) => p.status === "draft" || p.status === -1).length,
    totalViews: displayPosts.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
  };

  const router = useRouter();

  const getImageUrl = (url?: string) => {
    if (!url) return "/no-image-available.png";
    if (url.startsWith("http")) return url;
    return `${CDN_URL}/${url}`;
  };

  const handleAdd = () => {
    router.push("/admin/posts/new");
  };

  const handleEdit = (post: any) => {
    router.push(`/admin/posts/${post.id}`);
  };

  const handleDelete = (post: any) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };


  const handleConfirmDelete = async () => {
    if (!selectedPost) return;
    setIsDeleting(true);
    try {
      await postsApi.delete(selectedPost.id);
      setShowDeleteModal(false);
      setSelectedPost(null);
      await fetchPosts();
    } catch (err) {
      alert("Xoá bài viết thất bại. Vui lòng thử lại.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader
          title="Quản lý bài viết"
          description="Quản lý và xuất bản các bài viết trên website"
          actions={
            <Button variant="default" onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Viết bài mới
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng bài viết</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã xuất bản</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bản nháp</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategoryId === "all" ? "all" : String(selectedCategoryId)}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedCategoryId(v === "all" ? "all" : Number(v));
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả danh mục</option>
              {filterCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </Card>

        {/* Posts Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bài viết</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Danh mục</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tác giả</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lượt xem</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ngày tạo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={7} />
                ) : paginatedPosts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Không tìm thấy bài viết nào
                    </td>
                  </tr>
                ) : (
                  paginatedPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={getImageUrl(post.featuredImage)}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/no-image-available.png";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 mb-1 line-clamp-1">{post.title}</div>
                            {post.content && (
                              <div className="text-sm text-gray-500 line-clamp-1" dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').substring(0, 100) }} />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                        {typeof (post as any).category === "string"
                          ? (post as any).category
                          : (post as DisplayPost).category?.name ?? "—"}
                      </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{post.author}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{(post.views || 0).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {post.createdAt}
                        </div>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(post.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            itemLabel="bài viết"
          />
        </Card>
      </div>

      {/* Delete Confirm */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPost(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xoá bài viết"
        message={`Bạn có chắc chắn muốn xoá bài viết "${selectedPost?.title ?? ""}"? Hành động này không thể hoàn tác.`}
        confirmText={isDeleting ? "Đang xoá..." : "Xoá"}
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
