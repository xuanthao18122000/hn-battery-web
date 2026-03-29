"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Brand } from "@/lib/api/brands";
import type { Vehicle } from "@/lib/api/vehicles";
import { getImageUrl } from "@/utils/image";

function BrandCard({ brand }: { brand: Brand }) {
  const [imgError, setImgError] = useState(false);
  const { name, slug, logoUrl, description } = brand;
  const imageSrc = logoUrl ? getImageUrl(logoUrl) : "";

  return (
    <Link
      href={`/${slug}`}
      className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center text-center w-[160px] h-[160px] shrink-0"
    >
      <div className="w-20 h-20 mb-2 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
        {!imgError && imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xl font-bold text-gray-400">{name.charAt(0)}</span>
        )}
      </div>
      <span className="font-bold text-gray-900 text-sm group-hover:text-accent transition-colors leading-tight">
        {name}
      </span>
      {description ? (
        <span className="text-xs text-gray-500 mt-0.5 line-clamp-2" title={description}>
          {description}
        </span>
      ) : null}
    </Link>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [imgError, setImgError] = useState(false);
  const { name, slug, imageUrl } = vehicle;
  const imageSrc = imageUrl ? getImageUrl(imageUrl) : "";

  return (
    <Link
      href={`/${slug}`}
      className="group h-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center min-h-[120px]"
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
        {!imgError && imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 64px, 80px"
            quality={75}
            className="object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-xl font-bold text-gray-400">{name.charAt(0)}</span>
        )}
      </div>
      <span className="font-bold text-gray-900 text-sm group-hover:text-accent transition-colors text-center leading-tight line-clamp-2">
        {name}
      </span>
    </Link>
  );
}

interface HomeBrandSectionProps {
  brands: Brand[];
  carVehicles: Vehicle[];
  motoVehicles: Vehicle[];
}

export function HomeBrandSection({ brands, carVehicles, motoVehicles }: HomeBrandSectionProps) {
  return (
    <section className="container mx-auto px-4 pb-4 max-w-7xl mt-8">
      {/* Block 1: Title + Description */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl font-bold leading-snug text-accent mb-4 md:text-3xl">
          Thương Hiệu Ắc Quy
          <br className="sm:hidden" aria-hidden />
          <span className="hidden sm:inline"> </span>
          Chính Hãng
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Ắc Quy HN Sài Gòn phân phối độc quyền các thương hiệu ắc quy hàng đầu thế giới với chất lượng đảm bảo và giá cả hấp dẫn nhất cho mọi dòng xe ô tô và xe máy.
        </p>
      </div>

      {/* Block 2: Grid brands từ API - 2 hàng, hàng 1 ít hơn hoặc bằng hàng 2, căn giữa */}
      {brands.length > 0 && (() => {
        const n = brands.length;
        const firstRowCount = Math.floor(n / 2);
        const secondRowCount = n - firstRowCount;
        const firstRow = brands.slice(0, firstRowCount);
        const secondRow = brands.slice(firstRowCount);

        return (
          <div className="flex flex-col items-center gap-4">
            {firstRow.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {firstRow.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            )}
            {secondRow.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {secondRow.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Block 3: Thương hiệu xe ô tô chúng tôi phục vụ (từ API) */}
      {carVehicles.length > 0 && (
        <div className="mt-4 pt-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-accent text-center">
          Thương hiệu xe chúng tôi phục vụ
        </h2>
          <h2 className="mt-8 text-xl md:text-2xl font-bold text-center mb-8 text-gray-900">
          Ắc Quy Ô Tô
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {carVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      )}

      {/* Block 4: Ắc Quy Xe Máy & Mô Tô - 6 cột, 4 item thì căn giữa (cột 2-5) + CTA tư vấn ắc quy */}
      {motoVehicles.length > 0 && (
        <div className="mt-12 my-8 space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-900">
              Ắc Quy Xe Máy & Mô Tô
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
              {motoVehicles.map((vehicle, index) => {
                const center4 =
                  motoVehicles.length === 4 &&
                  (index === 0 ? 'md:col-start-2' : index === 1 ? 'md:col-start-3' : index === 2 ? 'md:col-start-4' : 'md:col-start-5');
                return (
                  <div key={vehicle.id} className={`h-full min-h-0 ${center4 || ''}`}>
                    <VehicleCard vehicle={vehicle} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
