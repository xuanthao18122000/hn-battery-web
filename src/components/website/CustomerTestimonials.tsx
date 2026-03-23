"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const OVERALL_RATING = 5.0;
const TOTAL_REVIEWS = 1247;

const TESTIMONIALS = [
  {
    name: "Anh Mạnh",
    location: "Quận 3",
    image: "https://giaphatbattery.com/wp-content/uploads/2025/11/44129a26866c17df8a2d4ac71d5c43d3c6fad9c8.jpg",
    text: "Xe giữa đường hết điện, gọi cứu hộ ắc quy của Ắc Quy HN. Kỹ thuật viên đến rất nhanh, thay ắc quy tại chỗ gọn gàng, chuyên nghiệp. Rất hài lòng!",
  },
  {
    name: "Chị Thu Hà",
    location: "Bình Tân",
    image: "https://giaphatbattery.com/wp-content/uploads/2025/11/98708a5c35017385ec3649a5716e2d6780465af6.jpg",
    text: "Đổi ắc quy Mazda 3 tại nhà, giá tốt, hàng chính hãng. Nhân viên lắp đặt cẩn thận và tư vấn rất nhiệt tình. Sẽ ủng hộ lâu dài.",
  },
  {
    name: "Anh Hoàng",
    location: "Quận 3",
    image: "https://giaphatbattery.com/wp-content/uploads/2025/11/c49a29ba39b6239efc83a98e76fe06e2191b1937.jpg",
    text: "Dịch vụ thay ắc quy tại nhà miễn phí, đúng hẹn, thao tác nhanh gọn sạch sẽ. Báo giá rõ ràng cho xe Vios. Rất đáng tin cậy.",
  },
  {
    name: "Chú Đức",
    location: "Quận 12",
    image: "https://giaphatbattery.com/wp-content/uploads/2025/11/33aa9515838a0c11aee211f21ed64771ad6890f2.jpg",
    text: "Đã dùng dịch vụ nhiều lần, lần nào cũng tư vấn đúng nhu cầu, bảo hành rõ ràng, có phiếu bảo hành điện tử đầy đủ. Tin tưởng Ắc Quy HN.",
  },
];

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
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4 shrink-0 flex items-center justify-center relative">
        {!imgError ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-50 text-2xl font-bold text-blue-600"
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
      <p className="text-sm text-gray-600 text-left leading-relaxed">
        {text}
      </p>
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
            KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI?
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Hơn 10,000+ khách hàng tin tưởng và hài lòng với dịch vụ của Ắc Quy HN
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
          <p className="text-sm text-gray-500">Từ {TOTAL_REVIEWS.toLocaleString("vi-VN")} đánh giá</p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TESTIMONIALS.map((item, index) => (
            <TestimonialCard
              key={index}
              name={item.name}
              location={item.location}
              image={item.image}
              text={item.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
