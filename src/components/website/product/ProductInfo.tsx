"use client";

import React from "react";

interface Product {
  product_id: number;
  product: string;
  ratings?: {
    count?: number;
    avg_point?: number;
  };
  [key: string]: any;
}

interface SelectedItem {
  barcode?: string;
  [key: string]: any;
}

interface ProductInfoProps {
  product: Product;
  selectedItem?: SelectedItem;
}

const ProductInfo = ({ product, selectedItem }: ProductInfoProps) => {
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Sao chép thành công");
      })
      .catch(() => {
        alert("Sao chép thất bại");
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex md:mt-2 md:flex-row flex-col gap-2">
        <h1
          className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 cursor-pointer"
          onClick={() => copyToClipboard(product?.product || "")}
        >
          {product?.product}
        </h1>
      </div>
    </div>
  );
};

export default ProductInfo;

