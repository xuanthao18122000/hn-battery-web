import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteUrl } from "@/config/site";
import { BannerMenu } from "@/components/website";
import { Breadcrumbs } from "@/components/website/common";
import { HomeLcpPreload } from "@/components/website/HomeLcpPreload";
import { sectionsApi } from "@/lib/api/sections";
import { brandsApi } from "@/lib/api/brands";
import { vehiclesApi, VehicleTypeEnum } from "@/lib/api/vehicles";
import type { Vehicle } from "@/lib/api/vehicles";

const HomeSections = dynamic(
  () =>
    import("@/components/website/HomeSections").then((m) => ({
      default: m.HomeSections,
    })),
  { ssr: true, loading: () => <div className="min-h-[120px]" aria-hidden /> },
);

const Commitments = dynamic(
  () =>
    import("@/components/website/Commitments").then((m) => ({
      default: m.Commitments,
    })),
  { ssr: true },
);

const HomeLatestNews = dynamic(
  () =>
    import("@/components/website/HomeLatestNews").then((m) => ({
      default: m.HomeLatestNews,
    })),
  { ssr: true, loading: () => <div className="min-h-[120px]" aria-hidden /> },
);

const CustomerTestimonials = dynamic(
  () =>
    import("@/components/website/CustomerTestimonials").then((m) => ({
      default: m.CustomerTestimonials,
    })),
  { ssr: true, loading: () => <div className="min-h-[100px]" aria-hidden /> },
);

const HomeBrandSection = dynamic(
  () =>
    import("@/components/website/HomeBrandSection").then((m) => ({
      default: m.HomeBrandSection,
    })),
  { ssr: true, loading: () => <div className="min-h-[200px]" aria-hidden /> },
);

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
    <>
      <HomeLcpPreload />
      <div className="min-h-screen bg-gray-100">
        <BannerMenu />
        <div className="container mx-auto max-w-7xl px-2 py-3 pb-8 sm:px-4 sm:py-4">
          <Breadcrumbs items={[]} currentPage="Trang chủ" />
          <HomeBrandSection
            brands={brands}
            carVehicles={carVehicles}
            motoVehicles={motoVehicles}
          />
          <HomeSections sections={sections} />
          <HomeLatestNews
            categoryId={34}
            title="Tin tức mới nhất"
            viewAllHref="/tin-tuc"
            sectionId="home-latest-news"
          />
          <HomeLatestNews
            categoryId={78}
            title="Dịch vụ của chúng tôi"
            viewAllHref="/dich-vu"
            sectionId="home-latest-services"
          />
          <Commitments />
          <CustomerTestimonials />
        </div>
      </div>
    </>
  );
}
