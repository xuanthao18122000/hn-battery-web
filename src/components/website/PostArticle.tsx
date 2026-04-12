import { PostImage } from "@/components/website/PostImage";
import type { Post } from "@/lib/api/posts";
import { getImageUrl } from "@/utils/image";
import { PageShell } from "@/components/website/ui";
import { Breadcrumbs } from "@/components/website/common";
import ParseHtmlContent from "@/components/website/ParseHtmlContent";

export function PostArticle({ post }: { post: Post }) {
  const published =
    post.publishedAt != null
      ? new Date(post.publishedAt)
      : new Date(post.createdAt);

  const breadcrumbItems =
    post.category && typeof post.category === "object"
      ? [{ name: post.category.name, slug: `/${post.category.slug}` }]
      : [];

  return (
    <article className="min-h-screen bg-background pb-5">
      <PageShell maxWidthClassName="max-w-5xl">
        <Breadcrumbs items={breadcrumbItems} currentPage={post.title} />
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{post.author?.fullName || "Hữu Nhật"}</span>
            <span>•</span>
            <time dateTime={published.toISOString()}>
              {new Intl.DateTimeFormat("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(published)}
            </time>
            {post.category && typeof post.category === "object" && (
              <>
                <span>•</span>
                <span>{post.category.name}</span>
              </>
            )}
          </div>
        </header>

        {post.content ? (
          <ParseHtmlContent html={post.content} collapsible={false} />
        ) : post.shortDescription ? (
          <p className="text-lg text-gray-700">{post.shortDescription}</p>
        ) : null}
      </PageShell>
    </article>
  );
}
