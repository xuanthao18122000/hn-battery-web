import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import { BannerMenu, HomeBrandSection, HomeSections, Commitments, CustomerTestimonials } from "@/components/website";
import { sectionsApi } from "@/lib/api/sections";
import { brandsApi } from "@/lib/api/brands";
import { vehiclesApi, VehicleTypeEnum } from "@/lib/api/vehicles";
import type { Vehicle } from "@/lib/api/vehicles";

async function getHomeSections() {
  try {
    const sections = await sectionsApi.getSectionsByPageFe("home");
    return Array.isArray(sections) ? sections : [];
  } catch {
    return [];
  }
}

async function getHomeBrands() {
  try {
    return await brandsApi.getListFe({ getFull: true });
  } catch {
    return [];
  }
}

async function getHomeVehicles(): Promise<{ carVehicles: Vehicle[]; motoVehicles: Vehicle[] }> {
  try {
    const [carVehicles, motoVehicles] = await Promise.all([
      vehiclesApi.getListFe({ type: VehicleTypeEnum.CAR, getFull: true }),
      vehiclesApi.getListFe({ type: VehicleTypeEnum.MOTO, getFull: true }),
    ]);
    return { carVehicles, motoVehicles };
  } catch {
    return { carVehicles: [], motoVehicles: [] };
  }
}

export const metadata: Metadata = {
  title: "Ắc Quy HN Sài Gòn | Ắc quy ô tô - xe máy chính hãng",
  description:
    "Ắc Quy HN Sài Gòn - Chuyên ắc quy ô tô, ắc quy xe máy chính hãng. ✓ Chất lượng ✓ Giá tốt ✓ Bảo hành. Liên hệ ngay để được tư vấn!",
  keywords:
    "ắc quy, ắc quy ô tô, ắc quy xe máy, pin ắc quy, Ắc Quy HN, Ắc Quy HN Sài Gòn, acquyhn, acquyhnsaigon, Ắc Quy, ắc quy chính hãng, TP.HCM, Sài Gòn",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ắc Quy HN Sài Gòn | Ắc quy ô tô - xe máy chính hãng",
    description:
      "Ắc Quy HN Sài Gòn - Ắc quy ô tô, xe máy chính hãng. Chất lượng, giá tốt, bảo hành.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ắc Quy HN Sài Gòn",
      },
    ],
  },
};

export default async function HomePage() {
  const [sections, brands, { carVehicles, motoVehicles }] = await Promise.all([
    getHomeSections(),
    getHomeBrands(),
    getHomeVehicles(),
  ]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
    >
      <BannerMenu />
      <HomeBrandSection
        brands={brands}
        carVehicles={carVehicles}
        motoVehicles={motoVehicles}
      />
      <HomeSections sections={sections} />
      <Commitments />
      <CustomerTestimonials />
    </div>
  );
}
