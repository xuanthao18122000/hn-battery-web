/**
 * URL / Domain tập trung — dùng env, fallback giữ đúng giá trị hiện tại.
 * Cấu hình: NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SITE_URL_ALT, NEXT_PUBLIC_API_URL, ...
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://acquytrungnguyen.com';

export const siteUrlAlt =
  process.env.NEXT_PUBLIC_SITE_URL_ALT || 'https://tinphatcons.vn';

export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/** Logo site (path tương đối trên domain chính) */
export const siteLogoPath = '/logo-web-1.png';
export const siteLogoUrl = `${siteUrl}${siteLogoPath}`;

/** Số điện thoại schema / hiển thị */
export const contactPhone =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || '+84-28-123-4567';

/** Hotline hiển thị (VD: 1800 6018) — dùng cho link tel: và hiển thị */
export const contactHotlineDisplay =
  process.env.NEXT_PUBLIC_CONTACT_HOTLINE_DISPLAY || '1800 6018';
/** Số hotline chỉ số (cho href tel:) */
export const contactHotlineTel =
  process.env.NEXT_PUBLIC_CONTACT_HOTLINE_TEL || '18006018';

/** Email liên hệ */
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@acquytrungnguyen.com';

/** Link chat Zalo (vd: https://zalo.me/0868300200) */
export const zaloChatUrl =
  process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0868300200';

/** Mạng xã hội (sameAs + Footer) */
export const socialLinks = {
  facebook:
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ||
    'https://facebook.com/acquytrungnguyen',
  linkedin:
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ||
    'https://www.linkedin.com/company/acquytrungnguyen',
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
