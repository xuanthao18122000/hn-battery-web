import { PostImage } from "@/components/website/PostImage";
import type { Post } from "@/lib/api/posts";
import { getImageUrl } from "@/utils/image";
import { PageShell } from "@/components/website/ui";

export function PostArticle({ post }: { post: Post }) {
  const published =
    post.publishedAt != null
      ? new Date(post.publishedAt)
      : new Date(post.createdAt);

  return (
    <article className="min-h-screen bg-background py-10">
      <PageShell maxWidthClassName="max-w-3xl">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{post.author?.fullName || "Admin"}</span>
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

        {post.featuredImage ? (
          <div className="mb-8 rounded-xl overflow-hidden ring-1 ring-gray-100 bg-gray-100 aspect-video max-h-[420px]">
            <PostImage
              src={getImageUrl(post.featuredImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {post.content ? (
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : post.shortDescription ? (
          <p className="text-lg text-gray-700">{post.shortDescription}</p>
        ) : null}
      </PageShell>
    </article>
  );
}
