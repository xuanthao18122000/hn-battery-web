import { notFound } from "next/navigation";
import { postsApi } from "@/lib/api/posts";
import { PostArticle } from "@/components/website/PostArticle";

export async function PagePostWrapper({
  postId,
  req,
}: {
  postId: number;
  req: { headers: Record<string, string> };
}) {
  try {
    const post = await postsApi.getByIdFe(postId, req);
    return <PostArticle post={post} />;
  } catch {
    notFound();
  }
}
