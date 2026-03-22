"use client";

import { use } from "react";
import PostForm from "@/components/admin/PostForm";
import { postsApi } from "@/lib/api/posts";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: PageProps) {
  const { id } = use(params);
  const postId = parseInt(id);

  return <PostForm postId={postId} />;
}
