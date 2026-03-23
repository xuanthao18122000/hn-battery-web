# Bài viết / danh mục POST — không hardcode path

## Đã làm

1. **Xóa route cố định** `(website)/kinh-nghiem-hay/*` — URL blog = **slug danh mục loại POST** từ API (`/fe/categories/tree`), ví dụ CMS vẫn có thể dùng slug `kinh-nghiem-hay` nhưng FE không gắn string đó trong code.

2. **`[slug]/page.tsx`**
   - `resolve === CATEGORY` và `category.type === POST` → **`PostsList`** + `postsApi.getListFe({ type: POST, categoryId })`; nếu root POST mà list rỗng → fallback `getListFe({ type: POST })` (tương thích bài chưa gán category).
   - `resolve === POST` → **`PostArticle`** + `postsApi.getBySlugFe(slug, req)` (SSR có IP).

3. **`[slug].html`**: POST redirect về `/${slug}` (canonical một segment).

4. **`News`**: “Xem tất cả” → `/${findPrimaryPostCategorySlug(tree)}` (tree từ `categoriesApi.getTree()`).

5. **`sitemap.ts`**: thêm entry `/${slug}` cho mọi danh mục `type === POST` (fetch tree, `revalidate` 1h).

6. **`PostsList`**: bỏ prop `basePath` (không dùng; link bài luôn `/${post.slug}`).

7. **`postsApi.getBySlugFe`**: nhánh SSR `fetchWithClientIP` giống product.

8. **Shared**: `lib/post-category.ts`, `lib/map-post-list-item.ts`, `components/website/PostArticle.tsx`.

## Verify

`npx tsc --noEmit`, `pnpm build`.

**Lưu ý:** Xóa route cũ xong, nếu còn `.next` cũ trỏ tới `kinh-nghiem-hay/page`, chạy lại `pnpm build` hoặc xóa `.next`.
