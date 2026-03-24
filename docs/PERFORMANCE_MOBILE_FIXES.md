# Mobile performance — checklist (đã áp dụng lại)

| File | Thay đổi |
|------|----------|
| `src/app/layout.tsx` | Bỏ `next/font` Roboto — dùng system stack trong `globals.css`. |
| `src/app/(website)/page.tsx` | `bg-(--color-bg-page)` (bỏ `bg-fixed`), `HomeLcpPreload`, `dynamic()` cho `HomeBrandSection`, `HomeSections`, `Commitments`, `CustomerTestimonials`. |
| `src/config/lcp.ts` | `HOME_HERO_SLIDESHOW_SRC`, quality, helpers preload `/_next/image`. |
| `src/components/website/HomeLcpPreload.tsx` | `<link rel="preload" as="image" … fetchPriority="high">`. |
| `BannerMenu.tsx` | Slide 0: `quality`, `fetchPriority`, cùng path hero với preload. |
| `HomeBrandSection.tsx` | `next/image` + `sizes` (80px / 64–80px) thay `<img>`. |
| `next.config.ts` | `images.minimumCacheTTL` 1y; `acquytrungnguyen.com` trong `remotePatterns`. |

**Khi banner API khác mock:** cập nhật `HOME_HERO_SLIDESHOW_SRC` + preload cho khớp slide 1.

**Lighthouse:** đo Incognito (tránh extension ~400 KiB “unused JS”).

```bash
cd ecommerce-web && pnpm build
```
