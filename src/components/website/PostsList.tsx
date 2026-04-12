import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import { PostImage } from "./PostImage";
import { PageShell } from "./ui";
import { Breadcrumbs } from "./common/Breadcrumbs";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  shortDescription?: string;
  thumbnail: string;
  category?: string;
  author?: string;
  publishedAt: Date;
  status: string;
}

interface PostsListProps {
  title: string;
  posts: Post[];
  description?: string;
  breadcrumbItems?: { name: string; slug?: string }[];
  currentPage?: number;
  totalPages?: number;
  basePath?: string;
}

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);

export const PostsList = ({
  title,
  posts,
  description,
  breadcrumbItems = [],
  currentPage = 1,
  totalPages = 1,
  basePath,
}: PostsListProps) => {
  const buildHref = (page: number) =>
    page <= 1 ? (basePath ?? "") : `${basePath ?? ""}?page=${page}`;
  const pageNumbers: number[] = [];
  if (totalPages > 1) {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = Math.max(1, end - 4); i <= end; i++) pageNumbers.push(i);
  }

  return (
    <section className="bg-bg-page pb-16">
      <PageShell maxWidthClassName="max-w-6xl">
        <Breadcrumbs items={breadcrumbItems} currentPage={title} />

        {/* Hero header */}
        <header className="mb-6 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              {description}
            </p>
          )}
        </header>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="text-base text-gray-500">
              Chưa có bài viết nào được xuất bản
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    className="group block h-full"
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-gray-200">
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
                        <PostImage
                          src={post.thumbnail}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {post.category && (
                          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">
                            {post.category}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary">
                          {post.title}
                        </h3>

                        {(post.shortDescription ?? post.excerpt) && (
                          <p className="line-clamp-2 text-sm text-gray-500">
                            {post.shortDescription ?? post.excerpt}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <UserRound className="h-3.5 w-3.5" />
                            {post.author || "Hữu Nhật"}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2">
            <Link
              href={buildHref(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage <= 1}
              className={`rounded-lg border px-3 py-2 text-sm ${
                currentPage <= 1
                  ? "pointer-events-none border-gray-200 text-gray-300"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Trước
            </Link>
            {pageNumbers.map((n) => (
              <Link
                key={n}
                href={buildHref(n)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  n === currentPage
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {n}
              </Link>
            ))}
            <Link
              href={buildHref(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage >= totalPages}
              className={`rounded-lg border px-3 py-2 text-sm ${
                currentPage >= totalPages
                  ? "pointer-events-none border-gray-200 text-gray-300"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sau
            </Link>
          </nav>
        )}
      </PageShell>
    </section>
  );
};
