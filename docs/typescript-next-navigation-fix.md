# TypeScript / Next fixes (session summary)

## 1. `usePathname` — IDE báo `next/navigation.js` không export

**Không được** thêm `paths` trong `tsconfig` trỏ `next/navigation` → file `.d.ts`. Next/Turbopack có thể dùng `paths` khi bundle → module runtime sai → prerender/build lỗi kiểu **`TypeError: (void 0) is not a function`** (vd. `/admin/categories` gọi `useRouter`).

**Cách xử lý IDE:** cùng phiên bản TypeScript với project, restart TS server, hoặc `npx tsc --noEmit` để xác nhận CLI không lỗi.

**Verify build:** `pnpm build` (exit 0).

---

## 2. `battery-capacities.ts` — `Pick<..., 'name'>` vs `BaseListParams`

**Cause:** `BaseListParams` is an alias of `PaginationParams`, which has no `name`. `name` exists on `ListBatteryCapacityParams`.

**Fix:** Use `Pick<ListBatteryCapacityParams, 'limit' | 'getFull' | 'name'>` for `getListFe` params.

**Verify:** same `tsc --noEmit`.

---

## 3. `pnpm build` — prerender `/admin/categories`

**Nguyên nhân:** `paths` → `navigation.d.ts` (mục 1 cũ).

**Đã làm:** gỡ alias `next/navigation` khỏi `tsconfig.json`.

**Verify:** `npx tsc --noEmit && pnpm build` → exit 0.
