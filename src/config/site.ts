/**
 * URL / Domain tập trung — dùng env, fallback giữ đúng giá trị hiện tại.
 * Cấu hình: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SITE_URL_ALT, NEXT_PUBLIC_API_URL, ...
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://acquyhnsaigon.com';

export const siteUrlAlt =
  process.env.NEXT_PUBLIC_SITE_URL_ALT || 'https://acquyhnsaigon.com';

export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/** Logo site (path tương đối trên domain chính) */
export const siteLogoPath = '/logo.jpg';
export const siteLogoUrl = `${siteUrl}${siteLogoPath}`;

/**
 * Địa chỉ cửa hàng (một địa chỉ duy nhất — storefront).
 */
export const storeAddress =
  process.env.NEXT_PUBLIC_STORE_ADDRESS ||
  '637 QL 1A, Phường Linh Xuân, TP. Hồ Chí Minh';

/** JSON-LD / schema.org (E.164) */
export const contactPhone =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || '+84349667891';

/** Hiển thị hotline (có khoảng) */
export const contactHotlineDisplay =
  process.env.NEXT_PUBLIC_CONTACT_HOTLINE_DISPLAY || '0349 667 891';

/** Số gọi (0xxxx) — `tel:` không có khoảng */
export const contactHotlineTel =
  process.env.NEXT_PUBLIC_CONTACT_HOTLINE_TEL || '0349667891';

/** Email liên hệ */
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@acquyhn.com';

/** Link chat Zalo — dùng cùng SĐT hotline */
export const zaloChatUrl =
  process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0349667891';

/** Mạng xã hội (sameAs + Footer) */
export const socialLinks = {
  facebook:
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ||
    'https://www.facebook.com/share/18R5RCKtz8/',
  linkedin:
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ||
    'https://www.linkedin.com/company/acquyhn',
  twitter:
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://twitter.com',
  instagram:
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || 'https://instagram.com',
  youtube:
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || 'https://youtube.com',
  pinterest:
    process.env.NEXT_PUBLIC_SOCIAL_PINTEREST || 'https://pinterest.com',
};

/** Hostname của site chính (dùng cho CORS / tinymce khi cần) */
export function getSiteHostname(): string {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return 'localhost';
  }
}
