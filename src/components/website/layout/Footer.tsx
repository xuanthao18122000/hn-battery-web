import { MapPin, Phone, Mail, Facebook, MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  socialLinks as configSocialLinks,
  storeAddress,
  contactHotlineTel,
  contactHotlineDisplay,
  contactEmail,
  zaloChatUrl,
} from "@/config/site";

const companyLinks = [
  { name: "Giới thiệu", href: "/about" },
  { name: "Liên hệ", href: "/contact" },
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

const connectExtraLinks: {
  label: string;
  linkText: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}[] = [
  {
    label: "Facebook",
    linkText: "Fanpage",
    icon: Facebook,
    href: configSocialLinks.facebook,
  },
  {
    label: "Zalo",
    linkText: "Chat Zalo",
    icon: MessageCircle,
    href: zaloChatUrl,
  },
];

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-900">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
          {/* 1. Thông tin công ty */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Thông tin công ty
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

          {/* 2. Chính sách */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">Chính sách</h3>
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

          {/* 3. Danh mục nổi bật */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Danh mục nổi bật
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

          {/* 4. Kết nối + liên hệ */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Kết nối với Ắc Quy HN
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 mb-4">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                <span>Địa chỉ: {storeAddress}</span>
              </li>
              <li className="flex gap-2 items-center flex-wrap">
                <Phone className="w-4 h-4 text-gray-600 shrink-0" />
                <span>Hotline:</span>
                <a
                  href={`tel:${contactHotlineTel}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactHotlineDisplay}
                </a>
              </li>
              <li className="flex gap-2 items-center flex-wrap">
                <Mail className="w-4 h-4 text-gray-600 shrink-0" />
                <span>Email:</span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {contactEmail}
                </a>
              </li>
              {connectExtraLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.href}
                    className="flex gap-2 items-center flex-wrap"
                  >
                    <Icon className="w-4 h-4 text-gray-600 shrink-0" />
                    <span>{item.label}:</span>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.linkText}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ắc Quy HN. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
