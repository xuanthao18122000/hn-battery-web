"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Link2 } from "lucide-react";
import { slugsApi, Slug, SlugTypeEnum } from "@/lib/api/slugs";
import { Pagination, TableSkeleton } from "@/components/admin";

const typeLabel: Record<SlugTypeEnum, string> = {
  [SlugTypeEnum.PRODUCT]: "PRODUCT",
  [SlugTypeEnum.CATEGORY]: "CATEGORY",
  [SlugTypeEnum.POST]: "POST",
  [SlugTypeEnum.VEHICLE]: "VEHICLE",
};

export default function AdminSlugsPage() {
  const [items, setItems] = useState<Slug[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | SlugTypeEnum>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;

  const stats = useMemo(() => {
    const product = items.filter((s) => s.type === SlugTypeEnum.PRODUCT).length;
    const category = items.filter((s) => s.type === SlugTypeEnum.CATEGORY).length;
    const post = items.filter((s) => s.type === SlugTypeEnum.POST).length;
    const vehicle = items.filter((s) => s.type === SlugTypeEnum.VEHICLE).length;
    return { total, product, category, post, vehicle };
  }, [items, total]);

  const fetchSlugs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params: any = { page: currentPage, limit: itemsPerPage };
      if (search) params.slug = search;
      if (type !== "all") params.type = Number(type) as SlugTypeEnum;

      const res = await slugsApi.getList(params);
      setItems(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách slug.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlugs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, type]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh sách Slug</h1>
            <p className="text-gray-600 text-sm">Xem danh sách slug (PRODUCT/CATEGORY/POST)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Link2 className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">PRODUCT</p>
                <p className="text-2xl font-bold text-gray-900">{stats.product}</p>
              </div>
              <Link2 className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">CATEGORY</p>
                <p className="text-2xl font-bold text-gray-900">{stats.category}</p>
              </div>
              <Link2 className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">POST</p>
                <p className="text-2xl font-bold text-gray-900">{stats.post}</p>
              </div>
              <Link2 className="w-8 h-8 text-amber-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">VEHICLE</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vehicle}</p>
              </div>
              <Link2 className="w-8 h-8 text-teal-600" />
            </div>
          </Card>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Tìm theo slug..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={type}
              onChange={(e) => {
                const v = e.target.value;
                setType(v === "all" ? "all" : (Number(v) as SlugTypeEnum));
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại</option>
              <option value={SlugTypeEnum.PRODUCT}>PRODUCT</option>
              <option value={SlugTypeEnum.CATEGORY}>CATEGORY</option>
              <option value={SlugTypeEnum.POST}>POST</option>
              <option value={SlugTypeEnum.VEHICLE}>VEHICLE</option>
            </select>
          </div>
        </Card>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Slug</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Updated</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton columns={5} />
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      Không có slug nào
                    </td>
                  </tr>
                ) : (
                  items.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">{s.id}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {typeLabel[s.type as SlugTypeEnum] ?? `Type ${s.type}`}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-sm text-gray-900">{s.slug}</code>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {s.createdAt ? new Date(s.createdAt).toLocaleString("vi-VN") : "-"}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {s.updatedAt ? new Date(s.updatedAt).toLocaleString("vi-VN") : "-"}
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
            itemLabel="slug"
          />
        </Card>
      </div>
    </div>
  );
}

