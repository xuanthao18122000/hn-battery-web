import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { socialLinks as configSocialLinks } from "@/config/site";

const addresses = [
  "207/3 Nguyễn Trọng Tuyển, P8, Phú Nhuận, Tp. Hồ Chí Minh.",
  "Số 635 Lê Văn Lương, P. Tân Phong, Q7 Thành Phố Hồ Chí Minh.",
];

const companyLinks = [
  { name: "Giới thiệu", href: "/gioi-thieu" },
  { name: "Liên hệ", href: "/#contact" },
  { name: "Câu hỏi thường gặp", href: "/faq" },
  { name: "Điều khoản dịch vụ", href: "/dieu-khoan-dich-vu" },
];

const policyLinks = [
  { name: "Chính sách thanh toán", href: "/chinh-sach-thanh-toan" },
  { name: "Chính sách bảo hành", href: "/chinh-sach-bao-hanh" },
  { name: "Chính sách vận chuyển", href: "/chinh-sach-van-chuyen" },
  { name: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
  { name: "Chính sách khiếu nại", href: "/chinh-sach-khieu-nai" },
  { name: "Chính sách bảo mật thông tin", href: "/chinh-sach-bao-mat" },
];

const featuredCategories = [
  { name: "Ắc Quy GS", href: "/ac-quy-gs" },
  { name: "Ắc Quy Đồng Nai", href: "/ac-quy-dong-nai" },
  { name: "Ắc Quy Vision", href: "/ac-quy-vision" },
  { name: "Ắc quy Delkor", href: "/ac-quy-delkor" },
  { name: "Ắc quy Varta", href: "/ac-quy-varta" },
  { name: "Ắc quy Bosch", href: "/ac-quy-bosch" },
  { name: "Ắc quy Toplite", href: "/ac-quy-toplite" },
];

const socialLinkItems: { name: string; icon: React.ComponentType<{ className?: string }>; href: string }[] = [
  { name: "Facebook", icon: Facebook, href: configSocialLinks.facebook },
  { name: "Twitter", icon: Twitter, href: configSocialLinks.twitter },
  { name: "Instagram", icon: Instagram, href: configSocialLinks.instagram },
  { name: "Youtube", icon: Youtube, href: configSocialLinks.youtube },
  {
    name: "Pinterest",
    icon: ({ className }: { className?: string }) => (
      <span className={className ?? "text-sm font-bold leading-none"}>P</span>
    ),
    href: configSocialLinks.pinterest,
  },
];

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 1. Liên hệ với chúng tôi */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Liên hệ với chúng tôi
            </h3>
            <p className="font-bold text-gray-900 mb-4">
              CÔNG TY TNHH TM CÔNG NGHIỆP GIA PHÁT
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              {addresses.map((addr, i) => (
                <li key={i} className="flex gap-2">
                  <MapPin className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                  <span>{addr}</span>
                </li>
              ))}
              <li className="flex gap-2 items-center">
                <MapPin className="w-4 h-4 text-gray-600 shrink-0" />
                <span>Địa chỉ đại lý:</span>
                <Link
                  href="/dai-ly"
                  className="text-blue-600 hover:underline"
                >
                  Xem Tất Cả
                </Link>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-gray-600 shrink-0" />
                <span>Hotline tư vấn & bán hàng:</span>
                <a
                  href="tel:0921552266"
                  className="text-blue-600 hover:underline"
                >
                  0921.552.266
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-gray-600 shrink-0" />
                <span>Email:</span>
                <a
                  href="mailto:acquygiaphathcm@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  acquygiaphathcm@gmail.com
                </a>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              MST: 0316469380 - *Do Sở Kế Hoạch và Đầu tư Thành Phố Hồ Chí
              Minh cấp ngày 01/09/2020
            </p>
          </div>

          {/* 2. Thông Tin Công Ty + Chính Sách */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                Thông Tin Công Ty
              </h3>
              <ul className="space-y-2">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                Chính Sách
              </h3>
              <ul className="space-y-2">
                {policyLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Danh Mục Nổi Bật */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Danh Mục Nổi Bật
            </h3>
            <ul className="space-y-2">
              {featuredCategories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Kết nối với Ắc quy Gia Phát */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Kết nối với Ắc quy Gia Phát
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {socialLinkItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-blue-600 hover:bg-gray-50 text-sm"
                  aria-label={item.name}
                >
                  {typeof item.icon === "function" ? (
                    <item.icon />
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
            {/* Trust / certification badges - placeholder */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200">
                DMCA.com
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200">
                ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
              </span>
              <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded border border-green-200">
                SECURE
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ắc quy Gia Phát. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
