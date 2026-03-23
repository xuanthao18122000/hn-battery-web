import { CheckCircle2 } from "lucide-react";

const features = [
  "Chứng Nhận Quản Lý Chất Lượng ISO 9001:2015",
  "Đội Ngũ Chuyên Gia Hơn 200 Người",
  "Tích Hợp Công Nghệ BIM Tiên Tiến",
  "Thực Hành Xây Dựng Bền Vững",
  "Kỷ Lục Giao Dự Án Đúng Hạn",
  "Chương Trình An Toàn Toàn Diện",
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
              Xây Dựng Uy Tín & Chất Lượng
            </h2>
            <p className="animate-on-scroll fade-in-up stagger-2 text-muted-foreground text-lg leading-relaxed mb-6">
              Ắc Quy HN Sài Gòn đã khẳng định mình là đối tác đáng tin cậy,
              cung cấp các dự án chất lượng cao trong các lĩnh vực dân dụng, thương mại
              và công nghiệp. Cam kết về chất lượng, tiến độ và sự hài lòng của khách hàng
              là điều làm nên sự khác biệt của chúng tôi.
            </p>
            <p className="animate-on-scroll fade-in-up stagger-3 text-muted-foreground text-lg leading-relaxed mb-8">
              Với đội ngũ kỹ sư, kiến trúc sư giàu kinh nghiệm,
              chúng tôi mang đến chuyên môn, độ tin cậy và giải pháp xây dựng tối ưu
              cho mọi dự án.
            </p>

            <div className="animate-on-scroll fade-in-up stagger-4 grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="animate-on-scroll fade-in-up stagger-5 inline-flex items-center justify-center gap-2 px-8 h-10 rounded-md text-sm font-medium bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
            >
              Tìm Hiểu Thêm Về Chúng Tôi
            </a>
          </div>

          {/* Stats Grid */}
          <div className="animate-on-scroll scale-in grid grid-cols-2 gap-6">
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">100+</div>
              <div className="text-muted-foreground">Dự Án Hoàn Thành</div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">50+</div>
              <div className="text-muted-foreground">Đội Ngũ</div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">10+</div>
              <div className="text-muted-foreground">Năm Kinh Nghiệm</div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <div className="text-5xl font-bold text-accent mb-2">100%</div>
              <div className="text-muted-foreground">Tỷ Lệ Hài Lòng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
