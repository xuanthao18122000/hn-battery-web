import type { Metadata } from "next";
import {
  siteUrlAlt,
  contactHotlineDisplay,
  contactHotlineTel,
  contactEmail,
  storeAddress,
} from "@/config/site";

export const metadata: Metadata = {
  title: "Giới thiệu - Công Ty TNHH Ắc Quy HN",
  description: "Giới thiệu về Công Ty TNHH Ắc Quy HN - Đơn vị chuyên cung cấp các sản phẩm ắc quy chất lượng cao, dịch vụ cứu hộ và lắp đặt ắc quy chuyên nghiệp",
  keywords: "giới thiệu công ty ắc quy, công ty Ắc Quy HN, Ắc Quy HN Sài Gòn, acquyhn, acquyhnsaigon, ắc quy chất lượng, dịch vụ ắc quy",
  alternates: {
    canonical: `${siteUrlAlt}/about`,
  },
  openGraph: {
    title: "Giới thiệu - Công Ty TNHH Ắc Quy HN",
    description: "Giới thiệu về Công Ty TNHH Ắc Quy HN - Đơn vị chuyên cung cấp các sản phẩm ắc quy chất lượng cao",
    url: `${siteUrlAlt}/about`,
    images: ["/og-image.jpg"],
  },
};

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Giới thiệu Công Ty TNHH Ắc Quy HN
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Đơn vị chuyên cung cấp các sản phẩm ắc quy chất lượng cao, dịch vụ cứu hộ và lắp đặt ắc quy chuyên nghiệp
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="prose prose-lg max-w-none">
            {/* About Company */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Về chúng tôi
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Công Ty TNHH Ắc Quy HN là đơn vị chuyên cung cấp các sản phẩm ắc quy chất lượng cao cho xe máy, xe ô tô và các phương tiện khác. Với nhiều năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin cậy của hàng nghìn khách hàng trên toàn quốc.
                </p>
                <p>
                  Chúng tôi chuyên cung cấp các thương hiệu ắc quy uy tín như Globe, Varta, Bosch, Rocket và nhiều thương hiệu khác. Tất cả sản phẩm đều được nhập khẩu chính hãng, đảm bảo chất lượng và có chế độ bảo hành rõ ràng.
                </p>
              </div>
            </div>

            {/* Services */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Dịch vụ của chúng tôi
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Cung cấp ắc quy chính hãng
                  </h3>
                  <p className="text-gray-700">
                    Chúng tôi cung cấp đầy đủ các loại ắc quy cho xe máy, xe ô tô, xe tải với nhiều thương hiệu uy tín, đảm bảo chất lượng và giá cả hợp lý.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Dịch vụ cứu hộ 24/7
                  </h3>
                  <p className="text-gray-700">
                    Dịch vụ cứu hộ ắc quy 24/7, sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi. Đội ngũ kỹ thuật viên chuyên nghiệp, trang thiết bị hiện đại.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Lắp đặt tại nhà
                  </h3>
                  <p className="text-gray-700">
                    Dịch vụ lắp đặt ắc quy tại nhà miễn phí vận chuyển trong nội thành. Đội ngũ kỹ thuật viên giàu kinh nghiệm, đảm bảo lắp đặt đúng kỹ thuật.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Tư vấn chuyên nghiệp
                  </h3>
                  <p className="text-gray-700">
                    Đội ngũ tư vấn chuyên nghiệp sẽ giúp bạn chọn loại ắc quy phù hợp nhất với xe của bạn. Tư vấn miễn phí, nhiệt tình.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Giá trị cốt lõi
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Chất lượng</h3>
                    <p>Chúng tôi cam kết chỉ cung cấp những sản phẩm ắc quy chính hãng, chất lượng cao, đảm bảo an toàn và hiệu quả sử dụng.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Uy tín</h3>
                    <p>Với nhiều năm kinh nghiệm, chúng tôi đã xây dựng được uy tín và niềm tin từ khách hàng. Mọi cam kết đều được thực hiện đúng như đã hứa.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Chuyên nghiệp</h3>
                    <p>Đội ngũ nhân viên được đào tạo chuyên nghiệp, có kinh nghiệm, luôn sẵn sàng phục vụ khách hàng một cách tốt nhất.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tận tâm</h3>
                    <p>Chúng tôi luôn đặt lợi ích của khách hàng lên hàng đầu, tư vấn tận tình để khách hàng có được sản phẩm phù hợp nhất.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Liên hệ với chúng tôi
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="font-semibold text-gray-900">Công Ty TNHH Ắc Quy HN</p>
                <p>Địa chỉ: {storeAddress}</p>
                <p>Hotline: <a href={`tel:${contactHotlineTel}`} className="text-primary hover:underline">{contactHotlineDisplay}</a></p>
                <p>Email: <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a></p>
                <p>Thời gian làm việc: 08:00 - 21:00 (Tất cả các ngày trong tuần)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
