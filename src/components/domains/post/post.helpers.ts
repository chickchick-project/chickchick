import { CreatePost, PostResponse } from "@/lib/hono/schemas/community.schema";
import { COMMUNITY_URL } from "../postDetail/postDetail.helpers";
import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";

type TSubmitNewPostResponse = {
  success: boolean;
  postId?: string;
  message?: string;
};

export async function submitNewPost(
  postFormData: CreatePost
): Promise<ApiSuccessResponse<PostResponse>> {
  const response = await fetch(`${COMMUNITY_URL}`, {
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

  return data;
}
