"use client";

import { use } from "react";
import CategoryForm from "@/components/admin/CategoryForm";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = use(params);
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    return (
      <div className="max-w-4xl w-full">
        <div className="text-center text-red-600">ID danh mục không hợp lệ</div>
      </div>
    );
  }

  return <CategoryForm categoryId={categoryId} />;
}
