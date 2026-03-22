/**
 * SSR Request utilities
 * Similar to ddv-web/utils/request.ts
 */

import { apiUrl } from '@/config/site';

export const getClientIP = (req: any): string => {
  const clientIP =
    req?.headers?.['x-forwarded-for'] ||
    req?.headers?.['x-real-ip'] ||
    req?.socket?.remoteAddress ||
    '';

  // Convert to string and get first IP if multiple are present
  return Array.isArray(clientIP) ? clientIP[0] : (clientIP as string).split(',')[0];
};

/**
 * Helper để thêm IP vào headers cho API calls
 */
export const getAPIHeaders = (req: any, additionalHeaders: Record<string, string> = {}) => {
  const ip = getClientIP(req);

  return {
    'X-Client-IP': ip,
    'X-Forwarded-For': ip,
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };
};

/**
 * Helper để fetch data với IP (for SSR)
 * Similar to ddv-web's fetchWithClientIP
 */
export const fetchWithClientIP = async (
  url: string,
  req: any,
  options: RequestInit = {},
): Promise<any> => {
  const headers = getAPIHeaders(req, options.headers as Record<string, string>);

  // Next.js App Router caches fetch() by default — API SSR phải fresh (CMS / admin debug)
  const { cache: _c, ...rest } = options;
  const response = await fetch(url, {
    ...rest,
    headers,
    cache: options.cache ?? 'no-store',
  });

  if (!response.ok) {
    if (response.status === 429 || response.status === 403) {
      return { statusCode: response.status, data: null, redirect: `/${response.status}` };
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Check if running on server
 */
export const isServer = typeof window === 'undefined';

/**
 * Get API base URL (for SSR)
 */
export const getApiBaseUrl = (): string => {
  if (isServer) {
    return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || apiUrl;
  }
  return process.env.NEXT_PUBLIC_API_URL || apiUrl;
};
