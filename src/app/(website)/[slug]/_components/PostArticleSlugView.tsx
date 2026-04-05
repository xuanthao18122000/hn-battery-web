import { notFound } from "next/navigation";
import { postsApi } from "@/lib/api/posts";
import { PostArticle } from "@/components/website/PostArticle";

export async function getPostArticleSlugElement({
  slug,
  req,
}: {
  slug: string;
  req: { headers: Record<string, string> };
}) {
  try {
    const post = await postsApi.getBySlugFe(slug, req);
    return <PostArticle post={post} />;
  } catch {
    notFound();
  }
}
