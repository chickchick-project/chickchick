import { TPostFormData } from "@/lib/queries/community/postQueries";

type TSubmitNewPostResponse = {
  success: boolean;
  postId?: string;
  message?: string;
};

export async function submitNewPost(
  postFormData: TPostFormData
): Promise<TSubmitNewPostResponse> {
  const response = await fetch("/api/community/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postFormData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }

  return { success: data.success, postId: data.post.id };
}
