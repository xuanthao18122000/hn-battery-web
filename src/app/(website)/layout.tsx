import { headers } from "next/headers";
import { Header, Footer, MobileBottomBar } from '@/components/website';
import { FloatingContactFab } from '@/components/website/common/FloatingContactFab';
import { getCachedCategoriesTree } from "@/lib/categories-for-layout";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const req = { headers: Object.fromEntries(headersList.entries()) };
  const categories = await getCachedCategoriesTree(req);

  return (
    <div className="min-h-screen">
      <Header categories={categories} />
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <Footer />
      <FloatingContactFab />
      <MobileBottomBar />
    </div>
  );
}
