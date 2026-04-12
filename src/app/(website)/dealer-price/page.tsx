import type { Metadata } from "next";
import { siteUrlAlt, contactHotlineTel, contactHotlineDisplay } from "@/config/site";
import { CheckCircle2, Phone } from 'lucide-react'
import { ICON_SIZE } from '@/lib/icons'
import { Breadcrumbs } from "@/components/website/common";

export const metadata: Metadata = {
  title: "Báo giá đại lý - Ắc Quy HN Sài Gòn",
  description: "Chương trình tuyển đại lý ắc quy trên toàn quốc. Chiết khấu tốt nhất, hỗ trợ marketing, kỹ thuật. Liên hệ ngay để nhận báo giá.",
  keywords: "báo giá đại lý, tuyển đại lý ắc quy, phân phối ắc quy, đại lý ắc quy, Ắc Quy HN, acquyhn, acquyhnsaigon, Ắc Quy HN Sài Gòn",
  alternates: {
    canonical: `${siteUrlAlt}/dealer-price`,
  },
  openGraph: {
    title: "Báo giá đại lý - Ắc Quy HN Sài Gòn",
    description: "Chương trình tuyển đại lý ắc quy trên toàn quốc với chiết khấu tốt nhất",
    url: `${siteUrlAlt}/dealer-price`,
    images: ["/og-image.jpg"],
  },
};

export default async function DealerPricePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 pt-4">
        <Breadcrumbs items={[]} currentPage="Báo giá đại lý" />
      </div>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Báo giá đại lý
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-2 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-4">
                Ắc quy là một trong những mặt hàng tiềm năng trên thị trường, nhu cầu sử dụng các sản phẩm dầu nhớt ngày một tăng, chính vì thế nhiều nhà đầu tư đã lựa chọn mặt hàng này để kinh doanh và việc tìm được một nhà phân phối dầu nhớt uy tín là điều hết sức quan trọng.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hiện tại, Ắc Quy HN Sài Gòn đang tuyển dụng đại lý khắp các tỉnh thành trên toàn quốc cho các thương hiệu Ắc quy nhập khẩu và được phân phối chính thức bởi Ắc Quy HN. Chúng tôi mong muốn hợp tác mở rộng thị trường tạo thu nhập ổn định lâu dài cho tất cả mọi khách hàng trên toàn quốc.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ắc Quy HN Sài Gòn chiết khấu % tốt nhất cho mọi khách hàng. Chúng tôi kêu gọi hợp tác từ các chủ doanh nghiệp, cửa hàng nội thất ô tô xe máy, tiệm sửa xe,…
              </p>
            </div>

            {/* Section 1: Cấp độ đại lý */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                1. Cấp độ đại lý
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Về cấp độ đại lý tại Ắc Quy HN, tùy thuộc vào nhu cầu kinh doanh của doanh nghiệp, có 3 cấp độ chính sau đây:
              </p>
              <div className="space-y-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Đại lý cấp 1:
                  </h3>
                  <p className="text-gray-700">
                    Phân phối chính thức tại các tỉnh thành trên toàn quốc.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Đại lý cấp 2:
                  </h3>
                  <p className="text-gray-700">
                    Phân phối cho các cửa hàng tại mỗi địa phương.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Đại lý cấp 3:
                  </h3>
                  <p className="text-gray-700">
                    Bán lẻ trực tiếp cho người tiêu dùng tại địa phương.
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Chúng tôi chủ động trong việc nhập hàng trong nước và quốc tế. Chỉ cần báo số lượng là chúng tôi có thể đáp ứng bất cứ lúc nào, thời gian và địa điểm.
              </p>
              <div className="bg-blue-50 border-l-4 border-primary p-4 rounded mb-4">
                <p className="text-gray-700 font-semibold">
                  Báo Giá Thiết Bị Định Vị Ô Tô Xe Máy
                </p>
                <p className="text-gray-700">
                  Báo giá giới thiệu khách hàng sẽ có hoa hồng 30%
                </p>
              </div>
            </div>

            {/* Section 2: Điều kiện */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                2. Điều kiện để trở thành đại lý
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Để trở thành đại lý chính thức của Ắc Quy HN Sài Gòn, doanh nghiệp cần có những điều kiện sau:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Có giấy phép đăng ký kinh doanh.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Có kiến thức trong lĩnh vực kinh doanh phù hợp với sản phẩm của Ắc Quy HN.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Có địa điểm kinh doanh, kho bãi ổn định, phục vụ cho việc kinh doanh.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Lên kế hoạch kinh doanh, mạng lưới khách hàng phân phối các sản phẩm dầu nhớt tại thị trường mà đại lý đăng ký.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Tham vọng và đam mê trong lĩnh vực dầu nhớt/ vỏ xe/ bình ác quy/ phụ tùng.</span>
                </li>
              </ul>
            </div>

            {/* Section 3: Quyền lợi */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                3. Quyền lợi khi trở thành đại lý
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Khi trở thành đại lý chính thức của Ắc Quy HN bạn sẽ được hưởng các quyền lợi sau:
              </p>

              {/* 3.1 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  3.1. Hưởng chiết khấu khi mua hàng định kỳ
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Dựa theo doanh số cam kết, Quý đại lý sẽ được chiết khấu trên doanh số mua hàng theo chương trình dành riêng đại lý của Ắc Quy HN.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Quý đại lý sẽ được hưởng khoản chiết khấu theo như tỷ lệ đã thỏa thuận từ đầu nếu đạt được doanh số mua hàng đã cam kết.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Chính sách chiết khấu sẽ độc lập và được tiến hành song song với các chương trình hỗ trợ hoặc thúc đẩy kinh doanh khác từ Ắc Quy HN cho Quý đại lý.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Khi đạt doanh số quý, năm theo quy định của đại diện Ắc Quy HN, Quý đại lý sẽ được hưởng chính sách thưởng quý, năm.</span>
                  </li>
                </ul>
              </div>

              {/* 3.2 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  3.2. Chính sách giá, bảo vệ giá
                </h3>
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    3.2.1. Giá mua hàng
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Giá dành cho Quý đại lý sẽ căn cứ vào kết quả mua hàng và các cam kết hợp tác khác.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Chính sách giá được xây dựng để đảm bảo tính cạnh tranh và lợi nhuận tối đa cho Quý đại lý trên thị trường.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    3.2.2. Bảo vệ giá
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Quý đại lý sẽ được bảo vệ giá đối với những mặt hàng cùng loại đang còn tồn trong kho trong trường hợp Ắc Quy HN tăng giá bán.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Việc bảo vệ giá chỉ áp dụng cho các mặt hàng có hóa đơn nhập hàng và phiếu bảo hành từ đại diện của Ắc Quy HN trong vòng 30 ngày kể từ ngày nhận được thông báo tăng giá.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 3.3 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  3.3. Hợp đồng nguyên tắc – công nợ
                </h3>
                <div className="mb-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    3.3.1. Hợp đồng nguyên tắc
                  </h4>
                  <p className="text-gray-700">
                    Quý đại lý sẽ được đưa vào danh sách ưu đãi của Ắc Quy HN, được hưởng các chính sách dành cho đại lý của Ắc Quy HN ngay sau khi hai bên ký HĐĐL.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    3.3.2. Công nợ mua hàng
                  </h4>
                  <p className="text-gray-700">
                    Trên cơ sở kết quả hợp tác và lịch sử thanh toán, Quý đại lý sẽ được hưởng các mức ưu đãi tốt nhất về chính sách công nợ theo thỏa thuận hợp tác riêng.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Chính sách hỗ trợ */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                4. Chính sách hỗ trợ
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Ắc Quy HN Sài Gòn luôn sẵn sàng hỗ trợ doanh nghiệp trong việc phát triển thị trường cũng như PR – Marketing khi trở thành đại lý của chúng tôi, cụ thể như sau:
              </p>

              {/* 4.1 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  4.1. Hỗ trợ phát triển thị trường
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Ắc Quy HN sẽ hỗ trợ về chiến lược kinh doanh, đào tạo bán hàng, sản phẩm,…</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Hỗ trợ về giải pháp bán hàng, xâm nhập thị trường (với đại lý mới), tìm kiếm và chăm sóc khách hàng…</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Hỗ trợ về giá – hàng hóa cạnh tranh.</span>
                  </li>
                </ul>
              </div>

              {/* 4.2 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  4.2. Hỗ trợ về PR – Marketing
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Quý đại lý được hỗ trợ catalogue, tờ rơi, banner, các vật phẩm quảng cáo…</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Quý đại lý được tham gia tất cả các chương trình khuyến mãi và thúc đẩy bán hàng.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Quý đại lý được cấp giấy chứng nhận là đại lý/ nhà phân phối chính thức.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Quý đại lý được hỗ trợ về hình ảnh, marketing online và offline</span>
                  </li>
                </ul>
              </div>

              {/* 4.3 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  4.3. Hỗ trợ kỹ thuật – giải pháp
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Được hỗ trợ kỹ thuật qua điện thoại, các phương tiện hỗ trợ trực tuyến.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Được tham gia khoá đào tạo về sản phẩm, công nghệ và kiến thức bán hàng.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Hãy liên hệ ngay để nhận báo giá có thương lượng
              </h2>
              <p className="text-lg mb-4 text-white">
                Có chính sách chiết khấu % tốt nhất ngày hôm nay
              </p>
              <p className="mb-6 text-white">
                Ắc Quy HN Sài Gòn rất hân hạnh khi được trở thành nhà phân phối chính thức cho các doanh nghiệp. Liên hệ ngay với chúng tôi qua hotline để được tư vấn, giải đáp thắc mắc trực tiếp.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <a
                  href={`tel:${contactHotlineTel}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone size={ICON_SIZE.lg} />
                  <span>{contactHotlineDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
