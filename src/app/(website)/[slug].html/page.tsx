import { notFound, redirect } from "next/navigation";
import { resolveApi, SlugTypeEnum } from "@/lib/api/resolve";
import { headers } from "next/headers";

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  // Remove .html extension if present
  const cleanSlug = slug.replace(/\.html$/, "");

  // Get request headers for SSR
  const headersList = await headers();
  const req = {
    headers: Object.fromEntries(headersList.entries()),
  };

  // Step 1: Resolve slug to get type (with req for SSR)
  let resolved;
  try {
    resolved = await resolveApi.resolveSlug(cleanSlug, req);
  } catch (error: any) {
    notFound();
  }

  // Step 2: Redirect based on type
  if (resolved.type === SlugTypeEnum.CATEGORY) {
    // Redirect to category page
    redirect(`/danh-muc/${cleanSlug}`);
  }

  if (resolved.type === SlugTypeEnum.PRODUCT) {
    redirect(`/san-pham/${cleanSlug}`);
  }

  if (resolved.type === SlugTypeEnum.POST) {
    redirect(`/kinh-nghiem-hay/${cleanSlug}`);
  }

  if (resolved.type === SlugTypeEnum.VEHICLE) {
    // Chưa có route xe, trả 404
    notFound();
  }

  notFound();
}
