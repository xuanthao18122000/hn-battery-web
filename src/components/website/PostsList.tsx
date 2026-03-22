import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PostImage } from "./PostImage";
import { PageHeader, PageShell, SectionCard } from "./ui";

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
  basePath?: string;
}

export const PostsList = ({ title, posts, basePath = "/kinh-nghiem-hay" }: PostsListProps) => {
  return (
    <section className="py-10">
      <PageShell maxWidthClassName="max-w-6xl">
        <PageHeader title={title} className="mb-8" />

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Chưa có bài viết nào được xuất bản
              </p>
            </CardContent>
          </Card>
        ) : (
          <SectionCard className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {posts.map((post) => (
                <Link key={post.id} href={`/${post.slug}`} className="block">
                  <article className="group cursor-pointer p-5 md:p-6 hover:bg-gray-50/60 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="shrink-0 w-full md:w-52 h-36 bg-gray-100 rounded-xl overflow-hidden ring-1 ring-gray-100">
                        <PostImage
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          {(post.shortDescription ?? post.excerpt) && (
                            <p className="text-sm text-gray-500 line-clamp-4 mt-2 wrap-break-word">
                              {post.shortDescription ?? post.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{post.author || "Admin"}</span>
                          <span>•</span>
                          <span>
                            {new Intl.DateTimeFormat("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).format(post.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </SectionCard>
        )}
      </PageShell>
    </section>
  );
};

