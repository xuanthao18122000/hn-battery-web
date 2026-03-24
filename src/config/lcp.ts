/** Ảnh hero slide đầu (khớp mock banner mặc định) — preload LCP. */
export const HOME_HERO_SLIDESHOW_SRC = "/slideshow_4.jpg";

/** Khớp quality trong BannerMenu — preload & <Image> cùng q. */
export const HOME_HERO_LCP_QUALITY = 85;

export const homeHeroImageSizes = "(max-width: 768px) 100vw, 1280px";

export function homeHeroImagePreloadSrcSet(quality = HOME_HERO_LCP_QUALITY): string {
  const enc = encodeURIComponent(HOME_HERO_SLIDESHOW_SRC);
  const widths = [640, 750, 828, 1080, 1200, 1920];
  return widths
    .map((w) => `/_next/image?url=${enc}&w=${w}&q=${quality} ${w}w`)
    .join(", ");
}

export function homeHeroImagePreloadHref(quality = HOME_HERO_LCP_QUALITY): string {
  const enc = encodeURIComponent(HOME_HERO_SLIDESHOW_SRC);
  return `/_next/image?url=${enc}&w=750&q=${quality}`;
}
