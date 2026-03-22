"use client";

import { use } from "react";
import BrandForm from "@/components/admin/BrandForm";

interface EditBrandPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = use(params);
  const brandId = parseInt(id, 10);

  if (isNaN(brandId)) {
    return (
      <div className="p-6">
        <div className="w-full">
          <div className="text-center text-red-600">ID thương hiệu không hợp lệ</div>
        </div>
      </div>
    );
  }

  return <BrandForm brandId={brandId} />;
}

