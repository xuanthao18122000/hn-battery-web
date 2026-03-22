/**
 * Base params dùng chung cho các API list (phân trang, sort).
 * Các module có thể kế thừa và thêm field riêng (name, status, ...).
 */

export interface PaginationParams {
  /** Trang hiện tại (1-based) */
  page?: number;
  /** Số item mỗi trang (1-50) */
  limit?: number;
  /** Lấy toàn bộ không phân trang */
  getFull?: boolean;
  /** Trường sắp xếp */
  sortBy?: string;
  /** Thứ tự: asc | desc */
  order?: 'asc' | 'desc';
}

export type BaseListParams = PaginationParams;
