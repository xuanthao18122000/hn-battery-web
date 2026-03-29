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
      className="group flex h-full min-h-[128px] w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:min-h-[140px] sm:p-4"
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
      className="group flex h-full min-h-[120px] flex-col items-center rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm transition-shadow hover:shadow-md sm:p-4"
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
    <section className="mb-4">
      <div className="rounded border border-gray-200 bg-white p-2.5 shadow-sm sm:p-4 md:p-6">
        <div className="mb-5 border-b border-gray-200 pb-4 text-center md:text-left">
          <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">
            <span className="block text-accent">Thương Hiệu Ắc Quy</span>
            <span className="mt-1 block text-lg font-semibold text-gray-900 md:mt-2 md:text-xl">
              Chính Hãng
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 md:mt-3 md:text-base">
            Ắc Quy HN Sài Gòn phân phối độc quyền các thương hiệu ắc quy hàng đầu thế giới với chất
            lượng đảm bảo và giá cả hấp dẫn nhất cho mọi dòng xe ô tô và xe máy.
          </p>
        </div>

        {brands.length > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6 lg:gap-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}

        {carVehicles.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="mb-2 text-center text-xl font-semibold text-accent md:text-2xl">
              Thương hiệu xe chúng tôi phục vụ
            </h2>
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-900 md:mb-8 md:text-xl">
              Ắc Quy Ô Tô
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-6 md:gap-4">
              {carVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        )}

        {motoVehicles.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-900 md:mb-8 md:text-xl">
              Ắc Quy Xe Máy & Mô Tô
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-6 md:gap-4">
              {motoVehicles.map((vehicle, index) => {
                const center4 =
                  motoVehicles.length === 4 &&
                  (index === 0
                    ? "md:col-start-2"
                    : index === 1
                      ? "md:col-start-3"
                      : index === 2
                        ? "md:col-start-4"
                        : "md:col-start-5");
                return (
                  <div key={vehicle.id} className={`h-full min-h-0 ${center4 || ""}`}>
                    <VehicleCard vehicle={vehicle} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
