/**
 * Format giá tiền theo kiểu Việt Nam: 2.000.000 ₫
 * Nếu giá không hợp lệ hoặc < 1000 → "Liên hệ"
 */
export const formatPrice = (price: number | string): string => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num) || num < 1000) return "Liên hệ";
  return num.toLocaleString("vi-VN") + " ₫";
};
