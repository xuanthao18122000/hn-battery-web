import {
  homeHeroImagePreloadHref,
  homeHeroImagePreloadSrcSet,
  homeHeroImageSizes,
} from "@/config/lcp";

/** Preload LCP hero — discoverable trong HTML + fetchpriority high. */
export function HomeLcpPreload() {
  return (
    <link
      rel="preload"
      as="image"
      href={homeHeroImagePreloadHref()}
      imageSrcSet={homeHeroImagePreloadSrcSet()}
      imageSizes={homeHeroImageSizes}
      fetchPriority="high"
    />
  );
}
