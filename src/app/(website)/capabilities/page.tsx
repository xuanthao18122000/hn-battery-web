import type { Metadata } from "next";
import { siteUrlAlt } from "@/config/site";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Building2, 
  Factory, 
  Store, 
  Home,
  Ruler,
  HardHat,
  Users,
  Award,
  ShieldCheck,
  Hammer,
  Wrench,
  Truck,
  ClipboardCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Năng Lực Thi Công",
  description: "Năng lực thi công của Ắc Quy HN Sài Gòn - Chuyên nghiệp với hơn 10 năm kinh nghiệm, đội ngũ kỹ sư giàu kinh nghiệm, máy móc thiết bị hiện đại, quy trình thi công khoa học đảm bảo chất lượng và tiến độ công trình.",
  keywords: "năng lực thi công, năng lực xây dựng, chứng chỉ xây dựng, máy móc thi công, đội ngũ xây dựng, quy trình thi công, Ắc Quy HN, Ắc Quy HN Sài Gòn, acquyhn, acquyhnsaigon",
  alternates: {
    canonical: `${siteUrlAlt}/capabilities`,
  },
  openGraph: {
    title: "Năng Lực Thi Công | Ắc Quy HN Sài Gòn",
    description: "Tìm hiểu về năng lực thi công chuyên nghiệp của Ắc Quy HN Sài Gòn",
    url: `${siteUrlAlt}/capabilities`,
    images: ["/og-image.jpg"],
  },
};

const constructionCapabilities = [
  {
    icon: Home,
    title: "Xây Dựng Dân Dụng",
    scale: "Quy mô: Từ 100m² đến 10.000m²",
    items: [
      "Nhà ở riêng lẻ (1-5 tầng)",
      "Biệt thự cao cấp",
      "Nhà phố thương mại",
      "Chung cư mini",
      "Khu đô thị",
      "Cải tạo, nâng cấp nhà cũ"
    ]
  },
  {
    icon: Factory,
    title: "Xây Dựng Công Nghiệp",
    scale: "Quy mô: Từ 500m² đến 50.000m²",
    items: [
      "Nhà xưởng sản xuất",
      "Nhà kho, logistics",
      "Nhà máy công nghiệp",
      "Trạm xử lý môi trường",
      "Hạ tầng kỹ thuật",
      "Khu công nghiệp"
    ]
  },
  {
    icon: Store,
    title: "Xây Dựng Thương Mại",
    scale: "Quy mô: Từ 200m² đến 20.000m²",
    items: [
      "Văn phòng làm việc",
      "Trung tâm thương mại",
      "Showroom, cửa hàng",
      "Khách sạn, resort",
      "Nhà hàng, cafe",
      "Trung tâm hội nghị"
    ]
  },
];

const technicalCapabilities = [
  {
    icon: Ruler,
    title: "Thiết Kế & Tư Vấn",
    description: "Đội ngũ kiến trúc sư và kỹ sư thiết kế giàu kinh nghiệm",
    items: [
      "Thiết kế kiến trúc",
      "Thiết kế kết cấu",
      "Thiết kế hệ thống M&E",
      "Tư vấn giải pháp tối ưu",
      "Dự toán chi phí chi tiết"
    ]
  },
  {
    icon: HardHat,
    title: "Thi Công & Quản Lý",
    description: "Quy trình thi công chuyên nghiệp, quản lý chặt chẽ",
    items: [
      "Quản lý dự án chuyên nghiệp",
      "Giám sát chất lượng 24/7",
      "Kiểm soát tiến độ nghiêm ngặt",
      "Báo cáo định kỳ cho chủ đầu tư",
      "Xử lý vấn đề phát sinh nhanh chóng"
    ]
  },
  {
    icon: ShieldCheck,
    title: "Chất Lượng & An Toàn",
    description: "Cam kết chất lượng và an toàn tuyệt đối",
    items: [
      "Kiểm tra chất lượng từng công đoạn",
      "Vật liệu đạt chuẩn chất lượng",
      "Tuân thủ quy chuẩn xây dựng",
      "An toàn lao động tuyệt đối",
      "Bảo hành công trình dài hạn"
    ]
  },
];

const equipmentList = [
  { icon: Truck, name: "Xe tải vận chuyển", quantity: "10+ chiếc" },
  { icon: HardHat, name: "Máy trộn bê tông", quantity: "5 bộ" },
  { icon: Hammer, name: "Máy đầm, máy cắt", quantity: "20+ bộ" },
  { icon: Wrench, name: "Máy hàn, máy khoan", quantity: "15+ bộ" },
  { icon: Building2, name: "Cần cẩu, thang máy", quantity: "3 bộ" },
  { icon: ClipboardCheck, name: "Thiết bị đo lường", quantity: "10+ bộ" },
];

const teamStructure = [
  { role: "Ban Lãnh Đạo", count: "5 người", description: "Chuyên gia quản lý 15+ năm kinh nghiệm" },
  { role: "Kỹ Sư Xây Dựng", count: "15 người", description: "Có bằng kỹ sư, chứng chỉ hành nghề" },
  { role: "Kiến Trúc Sư", count: "8 người", description: "Sáng tạo, giàu kinh nghiệm thiết kế" },
  { role: "Giám Sát Công Trình", count: "12 người", description: "Giám sát chất lượng chặt chẽ 24/7" },
  { role: "Trưởng Công Trường", count: "10 người", description: "Quản lý tiến độ và nhân sự hiệu quả" },
  { role: "Công Nhân Lành Nghề", count: "100+ người", description: "Tay nghề cao, nhiều năm kinh nghiệm" },
];

const certifications = [
  "Giấy phép kinh doanh xây dựng hạng II",
  "Chứng chỉ ISO 9001:2015 về quản lý chất lượng",
  "Chứng chỉ ISO 45001 về an toàn lao động",
  "Chứng chỉ năng lực hoạt động xây dựng",
  "Các giấy phép môi trường đầy đủ",
  "Bảo hiểm trách nhiệm công trình"
];

const constructionProcess = [
  {
    step: "01",
    title: "Khảo Sát & Tư Vấn",
    description: "Khảo sát thực địa, tư vấn giải pháp và lập dự toán chi tiết"
  },
  {
    step: "02",
    title: "Thiết Kế",
    description: "Thiết kế bản vẽ kiến trúc, kết cấu và hệ thống kỹ thuật"
  },
  {
    step: "03",
    title: "Ký Kết Hợp Đồng",
    description: "Thỏa thuận điều khoản, ký hợp đồng và thanh toán theo tiến độ"
  },
  {
    step: "04",
    title: "Chuẩn Bị Mặt Bằng",
    description: "San lấp, đào móng, chuẩn bị vật tư thiết bị"
  },
  {
    step: "05",
    title: "Thi Công Xây Dựng",
    description: "Thi công theo đúng bản vẽ, tiến độ và kiểm soát chất lượng"
  },
  {
    step: "06",
    title: "Nghiệm Thu & Bàn Giao",
    description: "Nghiệm thu công trình, hoàn thiện hồ sơ và bàn giao cho chủ đầu tư"
  },
];

const projectStats = [
  { number: "100+", label: "Dự Án Hoàn Thành", icon: Building2 },
  { number: "150+", label: "Đội Ngũ Nhân Sự", icon: Users },
  { number: "10+", label: "Năm Kinh Nghiệm", icon: Award },
  { number: "100%", label: "Cam Kết Chất Lượng", icon: ShieldCheck },
];

export default function CapabilitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="pt-32 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 text-base px-4 py-1">
              Chuyên Nghiệp - Uy Tín - Chất Lượng
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Năng Lực Thi Công Xây Dựng
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Với hơn 10 năm kinh nghiệm, đội ngũ chuyên nghiệp và trang thiết bị hiện đại, 
              Ắc Quy HN Sài Gòn tự hào là đối tác tin cậy cho mọi dự án xây dựng
            </p>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {projectStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Construction Capabilities */}
      <section className="py-20 bg-background" aria-labelledby="construction-capabilities">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="construction-capabilities" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lĩnh Vực Thi Công
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Chúng tôi có năng lực thi công đa dạng các loại hình công trình với quy mô khác nhau
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {constructionCapabilities.map((capability, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                    <capability.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {capability.title}
                  </h3>
                  <p className="text-accent font-semibold mb-6">
                    {capability.scale}
                  </p>
                  <ul className="space-y-3">
                    {capability.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Năng Lực Kỹ Thuật
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Đội ngũ chuyên gia và quy trình làm việc chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {technicalCapabilities.map((tech, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 my-4">
                    <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <tech.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {tech.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {tech.description}
                  </p>
                  <ul className="space-y-2">
                    {tech.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-1" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Structure */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Đội Ngũ Nhân Sự
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hơn 150 cán bộ kỹ sư và công nhân lành nghề sẵn sàng phục vụ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {teamStructure.map((team, index) => (
              <Card key={index} className="border-2 border-border hover:border-accent transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-foreground">
                      {team.role}
                    </h3>
                    <Badge variant="secondary" className="ml-2">
                      {team.count}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {team.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Máy Móc & Thiết Bị
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trang bị đầy đủ máy móc thiết bị hiện đại phục vụ thi công
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {equipmentList.map((equipment, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border hover:border-accent transition-colors"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <equipment.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {equipment.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {equipment.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Construction Process */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quy Trình Thi Công
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quy trình làm việc chuyên nghiệp, khoa học và minh bạch
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {constructionProcess.map((process, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent-foreground">
                        {process.step}
                      </span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {process.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Chứng Chỉ & Giấy Phép
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Đầy đủ chứng chỉ hành nghề và giấy phép hoạt động theo quy định
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-6 bg-card rounded-xl border border-border"
                >
                  <Award className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-foreground font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Sẵn Sàng Khởi Công Dự Án Của Bạn?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn chi tiết về năng lực 
            thi công và nhận báo giá miễn phí
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-md text-base font-medium bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
            >
              Liên Hệ Tư Vấn
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-md text-base font-medium border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Xem Dự Án Đã Thực Hiện
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


