import type { Metadata } from "next";
import { siteUrlAlt } from "@/config/site";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dự Án",
  description: "Khám phá 100+ dự án xây dựng đã hoàn thành của Ắc Quy HN Sài Gòn: biệt thự, nhà phố, nhà xưởng, văn phòng, khu dân cư. Uy tín - Chất lượng - Đúng tiến độ.",
  keywords: "dự án xây dựng, công trình đã hoàn thành, portfolio xây dựng, dự án biệt thự, dự án nhà xưởng, xây dựng TP.HCM",
  alternates: {
    canonical: `${siteUrlAlt}/projects`,
  },
  openGraph: {
    title: "Dự Án | Ắc Quy HN Sài Gòn",
    description: "Xem 100+ dự án xây dựng đã hoàn thành: biệt thự, nhà xưởng, văn phòng, khu dân cư",
    url: `${siteUrlAlt}/projects`,
    images: ["/og-image.jpg"],
  },
};

const allProjects = [
  { id: 1, title: "Biệt thự Quận 2", category: "Dân Dụng", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", location: "Thảo Điền, Quận 2, TP.HCM", area: "500m²", completion: "Hoàn thành 2024", status: "completed", description: "Biệt thự cao cấp với thiết kế hiện đại, sử dụng vật liệu nhập khẩu." },
  { id: 2, title: "Nhà xưởng KCN Hiệp Phước", category: "Công Nghiệp", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop", location: "KCN Hiệp Phước, TP.HCM", area: "5000m²", completion: "Đang thi công", status: "ongoing", description: "Nhà xưởng khung thép tiền chế, đáp ứng tiêu chuẩn công nghiệp hiện đại." },
  { id: 3, title: "Nhà phố Bình Thạnh", category: "Dân Dụng", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop", location: "Quận Bình Thạnh, TP.HCM", area: "64m²", completion: "Đang thi công", status: "ongoing", description: "Nhà phố 4 tầng, thiết kế tối ưu công năng sử dụng." },
  { id: 4, title: "VINHOMES SMART CITY", category: "Dân Dụng", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop", location: "Quận 9, TP.HCM", area: "100 căn hộ", completion: "Hoàn thành 2023", status: "completed", description: "Khu đô thị thông minh với đầy đủ tiện ích hiện đại." },
  { id: 5, title: "Nhà Máy Điện Gió Phú Lạc 2", category: "Công Nghiệp", image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&h=600&fit=crop", location: "Bình Thuận", area: "50MW", completion: "Hoàn thành 2023", status: "completed", description: "Dự án điện gió quy mô lớn, góp phần phát triển năng lượng sạch." },
  { id: 6, title: "SELAVIA Resort", category: "Thương Mại", image: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&h=600&fit=crop", location: "Phú Quốc", area: "10 hecta", completion: "Hoàn thành 2024", status: "completed", description: "Khu nghỉ dưỡng cao cấp với view biển tuyệt đẹp." },
  { id: 7, title: "Văn Phòng Hiện Đại CBD", category: "Thương Mại", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop", location: "Quận 1, TP.HCM", area: "20 tầng", completion: "Hoàn thành 2023", status: "completed", description: "Tòa nhà văn phòng hạng A tại trung tâm thành phố." },
  { id: 8, title: "Khu Dân Cư Cao Cấp Riverside", category: "Dân Dụng", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", location: "Quận 7, TP.HCM", area: "50 căn", completion: "Hoàn thành 2024", status: "completed", description: "Khu dân cư ven sông với không gian xanh mát." },
  { id: 9, title: "Trụ sở Công ty ABC", category: "Thương Mại", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", location: "Quận Tân Bình, TP.HCM", area: "800m²", completion: "Hoàn thành 2024", status: "completed", description: "Cải tạo và nâng cấp toàn bộ trụ sở công ty." },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Dự Án Của Chúng Tôi</h1>
            <p className="text-muted-foreground text-lg">Khám phá các dự án đã hoàn thành và đang triển khai của Ắc Quy HN Sài Gòn</p>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="relative overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge className="bg-accent text-accent-foreground">{project.category}</Badge>
                    {project.status === "ongoing" && <Badge variant="secondary">Đang thi công</Badge>}
                  </div>
                </div>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><span className="font-semibold text-foreground">📍 Vị trí:</span>{project.location}</p>
                    <p className="flex items-center gap-2"><span className="font-semibold text-foreground">📐 Diện tích:</span>{project.area}</p>
                    <p className="flex items-center gap-2"><span className="font-semibold text-foreground">📅 Tiến độ:</span>{project.completion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="max-w-3xl mx-auto mt-12 text-center">
            <a href="/#projects" className="text-muted-foreground hover:text-accent transition-colors">← Quay lại trang chủ</a>
          </div>
        </div>
      </section>
    </div>
  );
}
