# Tối ưu performance trang chi tiết sản phẩm (`/[slug]` product)

## Đã làm

1. **Bỏ barrel `@/components/website`** trên route này — import trực tiếp từng file (`Breadcrumbs`, `ProductInfo`, …) để bundler không kéo cả Hero, News, animation, v.v.
2. **`next.config.ts`**: `experimental.optimizePackageImports: ['lucide-react']` (tree-shake icon).
3. **`compiler.removeConsole`** (chỉ production).
4. **`package.json` `browserslist`** — giảm polyfill legacy (ảnh hưởng build; Lighthouse dev vẫn có thể báo polyfill localhost).
5. **`ProductDescriptionBlock`**: `next/dynamic` + skeleton — tách chunk, giảm JS parse trên main thread lúc load.
6. **LCP ảnh**: `ProductDetailLeft` — `priority` + `sizes` + `quality` cho ảnh chính; thumbnail `sizes="80px"`.
7. **`BlurImage`**: bỏ blur transition khi `priority` (ảnh LCP); `transition-all` → `transition-opacity` cho non-priority.
8. **Giảm JS**: `ProductDetailLeft` thay `lucide` chevron bằng SVG inline; `ProductDetailRight` thay icon X; `ProductInfo` xóa dead code + lucide không dùng.
9. **`ProductDescriptionBlock`**: `content-visibility: auto` + `contain-intrinsic-size` (render dài ít chặn main thread hơn khi scroll).

## Lighthouse / local

- **Minify JS / unused JS** trên `localhost` + `next dev` thường xấu hơn production (`next build && next start`).
- **bfcache** “4 failure reasons” — thường do extension, `unload`, permission, hoặc cache header; đo lại trên production không extension.

## Gợi ý thêm (chưa làm)

- Thay `alert` copy title bằng toast nhẹ hoặc `aria-live` (tránh sync dialog chặn main thread).
- Nếu API mô tả quá lớn: sanitize + truncate SSR hoặc lazy iframe (hiếm).
