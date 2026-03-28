"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const OVERALL_RATING = 5.0;
const TOTAL_REVIEWS = 1247;

const TESTIMONIALS = [
  {
    name: "Anh Minh",
    location: "Thủ Đức",
    image: "/a-minh.jpg",
    text: "Xe tôi chết máy giữa đường lúc tối, gọi là có mặt nhanh thật. Nhân viên nhiệt tình, thay bình nhanh gọn, giá hợp lý.",
  },
  {
    name: "Chị Lan",
    location: "Quận 9",
    image: "/c-lan.jpg",
    text: "Mình thay ắc quy ở đây 2 lần rồi, lần nào cũng thấy ok. Bình dùng ổn định, có bảo hành rõ ràng nên rất yên tâm.",
  },
  {
    name: "Anh Tuấn",
    location: "Dĩ An",
    image: "/a-tuan.jpg",
    text: "Dịch vụ 24/7 rất tiện, gọi khuya vẫn hỗ trợ. Làm việc chuyên nghiệp, không chặt chém như một số chỗ khác.",
  },
  {
    name: "Anh Hưng",
    location: "Linh Xuân",
    image: "/a-hung.jpg",
    text: "Nhân viên kiểm tra kỹ trước khi thay, tư vấn đúng bệnh chứ không ép khách mua. Rất đáng tin cậy.",
  },
  {
    name: "Chị Thảo",
    location: "Thủ Đức",
    image: "/c-thao.jpg",
    text: "Thay tận nơi nhanh, chỉ khoảng 20 phút là xong. Giá báo trước, không phát sinh thêm.",
  },
  {
    name: "Anh Phúc",
    location: "Quận 2",
    image: "/a-phuc.jpg",
    text: "Ắc quy chính hãng, có tem đầy đủ. Dùng hơn 1 năm vẫn rất ổn, sẽ ủng hộ lâu dài.",
  },
];

const TRUST_POINTS = [
  "Phục vụ nhanh 15–30 phút",
  "Cứu hộ 24/7, có mặt mọi lúc",
  "Sản phẩm chính hãng, bảo hành rõ ràng",
  "Giá minh bạch – không phát sinh",
] as const;

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5 text-amber-400">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-current" />
      ))}
    </div>
  );
}

function TestimonialCard({
  name,
  location,
  image,
  text,
}: {
  name: string;
  location: string;
  image: string;
  text: string;
}) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 flex flex-col items-center text-center">
      <div className="relative mb-4 h-32 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200/80">
        {!imgError ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="96px"
            className="object-contain object-center"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 text-2xl font-bold text-blue-600"
            aria-hidden
          >
            {name.charAt(0)}
          </span>
        )}
      </div>
      <p className="font-semibold text-gray-900 mb-0.5">
        {name} - {location}
      </p>
      <div className="mb-3">
        <StarRating />
      </div>
      <p className="text-sm text-gray-600 text-left leading-relaxed">{text}</p>
    </div>
  );
}

export function CustomerTestimonials() {
  return (
    <section
      id="khach-hang-noi-gi"
      className="py-14 md:py-16 bg-white border-t border-gray-100"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Hơn 10.000+ khách hàng tin tưởng dịch vụ Ắc Quy HN tại TP.HCM và
            vùng lân cận
          </p>
        </div>

        {/* Overall rating */}
        <div className="text-center mb-10">
          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
            {OVERALL_RATING.toFixed(1)}
          </div>
          <div className="flex justify-center mb-1">
            <StarRating />
          </div>
          <p className="text-sm text-gray-500">
            Từ {TOTAL_REVIEWS.toLocaleString("vi-VN")} đánh giá
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard
              key={`${item.name}-${item.location}`}
              name={item.name}
              location={item.location}
              image={item.image}
              text={item.text}
            />
          ))}
        </div>

        <div className="mt-14 md:mt-16">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-8">
            Vì sao khách hàng tin tưởng Ắc Quy HN?
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {TRUST_POINTS.map((line) => (
              <div
                key={line}
                className="flex h-full min-h-26 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-5 py-7 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/3 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  className="mb-4 block h-1 w-12 shrink-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-500"
                  aria-hidden
                />
                <p className="max-w-[16rem] text-[0.9375rem] font-medium leading-relaxed text-gray-800 md:text-base">
                  {line}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-base font-semibold text-gray-900 md:text-lg">
            Ắc Quy HN – Uy tín từ trải nghiệm thực tế của khách hàng
          </p>
        </div>
      </div>
    </section>
  );
}
