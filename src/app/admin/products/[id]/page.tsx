"use client";

import { use } from "react";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const productId = parseInt(id);

  if (isNaN(productId)) {
    return (
      <div className="max-w-4xl w-full">
        <div className="text-center text-red-600">ID sản phẩm không hợp lệ</div>
      </div>
    );
  }

  return <ProductForm productId={productId} />;
}
