# SEO Optimization - Ắc quy Trung Nguyên

## ✅ Đã Thực Hiện

### 1. **Technical SEO**
- ✅ Sitemap.xml tự động (`/sitemap.xml`)
- ✅ Robots.txt (`/robots.txt`)
- ✅ Manifest.json cho PWA (`/manifest.json`)
- ✅ Canonical URLs cho tất cả các trang
- ✅ Meta robots tags
- ✅ Structured Data (JSON-LD) cho Organization
- ✅ Semantic HTML (header, article, section, nav)

### 2. **On-Page SEO**
- ✅ Title tags tối ưu (50-60 ký tự)
- ✅ Meta descriptions hấp dẫn (150-160 ký tự)
- ✅ Heading hierarchy (H1 → H2 → H3)
- ✅ Alt text có ý nghĩa cho tất cả images
- ✅ Width/height cho images (tránh CLS)
- ✅ Internal linking structure
- ✅ Keywords tự nhiên trong content

### 3. **Open Graph & Social**
- ✅ Open Graph tags (Facebook)
- ✅ Twitter Card tags
- ✅ og:image (1200x630px)
- ✅ Locale (vi_VN)

### 4. **Performance SEO**
- ✅ Images lazy loading (trừ hero image)
- ✅ Hero image với fetchPriority="high"
- ✅ CSS animations (không dùng JS heavy libraries)
- ✅ Server-side rendering (SSR)
- ✅ Static generation (SSG) cho pages

## 📋 Cần Thực Hiện Thêm

### 1. **Images**
```bash
# Tạo các file images sau:
- public/logo.png (logo công ty)
- public/og-image.jpg (1200x630px - Open Graph image)
- public/icon-192.png (PWA icon)
- public/icon-512.png (PWA icon)
- public/favicon.ico (hiện đã có, check lại)
```

### 2. **Google Services**
```bash
# Sau khi deploy:
1. Đăng ký Google Search Console
3. Lấy verification code và thêm vào src/app/layout.tsx:
   
   metadata: {
     verification: {
       google: 'your-google-verification-code',
     },
   }

4. Đăng ký Google Analytics (GA4)
5. Đăng ký Google Business Profile (quan trọng cho local SEO)
```

### 3. **Schema Markup (Nâng cao)**
Thêm structured data cho:
- ✅ Organization (đã có)
- ⏳ LocalBusiness (cho local SEO)
- ⏳ BreadcrumbList (cho navigation)
- ⏳ Article (cho blog posts)
- ⏳ AggregateRating (khi có reviews)

### 4. **Content Optimization**
- ⏳ Viết thêm blog posts về xây dựng (target long-tail keywords)
- ⏳ Thêm FAQ section (tốt cho featured snippets)
- ⏳ Thêm testimonials/reviews (social proof)
- ⏳ Thêm case studies chi tiết cho các dự án
- ⏳ Tạo landing pages cho từng loại dự án:
  - Xây biệt thự tại TP.HCM
  - Xây nhà xưởng
  - Xây nhà phố
  - v.v.

### 5. **Local SEO** (Rất quan trọng cho công ty xây dựng!)
```json
// Thêm LocalBusiness schema vào layout.tsx:
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Ắc quy Trung Nguyên",
  "image": "https://acquyhnsaigon.com/logo-final.svg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Đường ABC", // Update thật
    "addressLocality": "TP. Hồ Chí Minh",
    "postalCode": "700000",
    "addressCountry": "VN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 10.8231,  // Update thật
    "longitude": 106.6297
  },
  "telephone": "+84-28-123-4567",
  "priceRange": "$$",
  "openingHours": "Mo-Fr 08:00-18:00",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "50"
  }
}
```

### 6. **External Links & Citations**
- ⏳ Đăng ký Google Business Profile (quan trọng nhất!)
- ⏳ Tạo profiles trên:
  - Facebook Business
  - LinkedIn Company Page
  - Zalo Official Account
  - Các directory xây dựng Việt Nam
- ⏳ Get backlinks from:
  - Bài PR trên báo điện tử
  - Đối tác, nhà cung cấp
  - Khách hàng (case studies)

### 7. **Mobile Optimization**
- ✅ Responsive design (đã có)
- ⏳ Test với Google Mobile-Friendly Test
- ⏳ Optimize tap targets (buttons, links)
- ⏳ Check font sizes trên mobile

### 8. **Speed Optimization**
```bash
# Chạy tests:
1. PageSpeed Insights: https://pagespeed.web.dev/
2. GTmetrix
3. WebPageTest

# Cải thiện:
- Optimize images (WebP format)
- Add CDN (Cloudflare, Vercel Edge)
- Minimize CSS/JS
- Enable compression
```

## 🎯 Target Keywords (Ví dụ)

### Primary Keywords:

## 📊 Monitoring & Analytics

### Tools cần setup:
1. **Google Search Console** - Track search performance
2. **Google Analytics 4** - Track user behavior
3. **Google Business Profile** - Local search
4. **Hotjar/Microsoft Clarity** - Heatmaps
5. **Ahrefs/SEMrush** - Keyword research & backlinks

### KPIs cần theo dõi:
- Organic traffic
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate
- Time on site
- Conversions (form submissions, calls)
- Google Business Profile insights

## 🚀 Quick Wins (Làm ngay!)

1. **Google Business Profile** - Setup trong 1 ngày, hiệu quả ngay
2. **Submit sitemap** - Ngay sau khi deploy
3. **Tạo Facebook Page** - Share content, build audience
4. **Viết 5-10 blog posts** - Content is king
5. **Get first reviews** - Ask khách hàng cũ review trên Google

## 📝 Content Calendar (Đề xuất)

### Tháng 1:
- 2 bài về dự án hoàn thành
- 1 bài kiến thức xây dựng

### Mỗi tháng:
- 4-6 blog posts
- 2-3 dự án mới
- Updates trên social media

## ⚠️ Lưu Ý

1. **NAP Consistency** (Name, Address, Phone):
   - Giữ thông tin giống nhau ở mọi nơi
   - Google, Facebook, Website, Directory

2. **Domain Authority**:
   - Mới bắt đầu sẽ mất 3-6 tháng để thấy kết quả
   - Focus vào quality content và backlinks

3. **Local Reviews**:
   - Rất quan trọng cho local SEO
   - Encourage khách hàng review trên Google
   - Respond to all reviews (positive & negative)

4. **Update Regularly**:
   - Google thích fresh content
   - Update news, projects thường xuyên
   - Keep content relevant

## 📞 Contact Info cần cập nhật

Đảm bảo thông tin sau đúng và nhất quán:
- ✅ Phone: +84 (028) 123-4567
- ⏳ Address: [Cập nhật địa chỉ thật]
- ✅ Email: info@tinphatcons.vn
- ⏳ Working hours: Thứ 2 - Thứ 6, 8:00 - 18:00
- ⏳ Social media links (Facebook, LinkedIn, Zalo)

