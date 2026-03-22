"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  FolderTree,
  FileText,
  Link2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  LayoutGrid,
  Tags,
  Car,
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/contacts", label: "Thông tin liên hệ", icon: MessageSquare },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/brands", label: "Thương hiệu", icon: Tags },
  { href: "/admin/vehicles", label: "Dòng xe", icon: Car },
  { href: "/admin/sections", label: "Cấu hình block", icon: LayoutGrid },
  { href: "/admin/posts", label: "Bài viết", icon: FileText },
  { href: "/admin/slugs", label: "Slugs", icon: Link2 },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed và sticky */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40
        bg-white border-r border-gray-100
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                Admin Panel
              </h1>
            )}
            {!sidebarOpen && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                    ${!sidebarOpen ? "justify-center" : ""}
                  `}
                  onClick={() => {
                    // Chỉ đóng sidebar trên mobile, không đóng trên desktop
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  title={!sidebarOpen ? item.label : ""}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : ""}`}
                  />
                  {sidebarOpen && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            {sidebarOpen ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content - với margin left để tránh sidebar */}
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
      `}
      >
        {/* Sticky Header */}
        <header
          className={`
          sticky top-0 z-30 bg-white border-b border-gray-100
          transition-shadow duration-200
          ${isScrolled ? "shadow-md" : "shadow-sm"}
        `}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop toggle button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                title={sidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
              >
                {sidebarOpen ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {menuItems.find(
                    (item) =>
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/"),
                  )?.label || "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {pathname === "/admin/dashboard" && "Tổng quan hệ thống"}
                  {pathname === "/admin/contacts" &&
                    "Quản lý thông tin khách hàng"}
                  {pathname === "/admin/products" && "Quản lý sản phẩm"}
                  {pathname === "/admin/categories" && "Quản lý danh mục"}
                  {pathname === "/admin/brands" && "Quản lý thương hiệu"}
                  {pathname === "/admin/vehicles" && "Quản lý dòng xe"}
                  {(pathname === "/admin/sections" ||
                    pathname?.toString().startsWith("/admin/sections/")) &&
                    "Cấu hình block hiển thị trang chủ"}
                  {pathname === "/admin/posts" && "Quản lý bài viết"}
                  {pathname === "/admin/settings" && "Cài đặt hệ thống"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {sidebarOpen && (
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-gray-900">
                        Admin
                      </div>
                      <div className="text-xs text-gray-500">Quản trị viên</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </div>
  );
}
