import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const features = [
  "Ắc quy chính hãng cho xe máy, ô tô, xe tải",
  "Thay tận nơi nhanh (15–30 phút)",
  "Cứu hộ ắc quy 24/7",
  "Tư vấn – kiểm tra điện miễn phí",
  "Giá minh bạch, bảo hành theo hãng",
  "Thu đổi bình cũ giá tốt",
];

export const About = () => {
  return (
    <section id="about" className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="animate-on-scroll fade-in-up text-accent font-semibold text-sm uppercase tracking-wider">
              Giới Thiệu
            </span>
            <h2 className="animate-on-scroll fade-in-up stagger-1 text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Uy tín từ ắc quy chính hãng
            </h2>
            <p className="animate-on-scroll fade-in-up stagger-2 text-muted-foreground text-lg leading-relaxed mb-6">
              Ắc Quy HN chuyên cung cấp và phân phối ắc quy chính hãng cho xe máy, ô tô và thiết bị
              điện dân dụng — lấy uy tín làm nền tảng, phục vụ tận tâm tại TP. Hồ Chí Minh và vùng
              lân cận.
            </p>
            <p className="animate-on-scroll fade-in-up stagger-3 text-muted-foreground text-lg leading-relaxed mb-8">
              Đa dạng thương hiệu như GS, Rocket, Yamato…; cứu hộ 24/7, thay tận nơi nhanh chóng.
              Đội ngũ kỹ thuật giàu kinh nghiệm, sẵn sàng đồng hành cùng bạn.
            </p>

            <div className="animate-on-scroll fade-in-up stagger-4 grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="animate-on-scroll fade-in-up stagger-5 inline-flex items-center justify-center gap-2 px-8 h-10 rounded-md text-sm font-medium bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
            >
              Giới thiệu chi tiết
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="animate-on-scroll scale-in grid grid-cols-2 gap-6">
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Cứu hộ &amp; hotline</div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">15–30′</div>
              <div className="text-muted-foreground">Có mặt tận nơi</div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">100%</div>
              <div className="text-muted-foreground">Chính hãng</div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">TP.HCM</div>
              <div className="text-muted-foreground">Phục vụ &amp; lân cận</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
