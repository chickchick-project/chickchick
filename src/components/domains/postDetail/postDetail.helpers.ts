import { TPostDetail } from "@/lib/queries/community/postQueries";
import { cookies } from "next/headers";

const API_BASE_URL = "http://localhost:3000/api";

type TPostDetailApiResponse = {
  success: boolean;
  data: TPostDetail | null;
  message?: string;
};

export async function getPostDetailById(
  postId: string
): Promise<TPostDetailApiResponse> {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${API_BASE_URL}/community/post/${postId}`, {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Error fetching post ${postId}:`, data.message);
      return {
        data: null,
        success: false,
        message: data.message || "서버 내부 오류가 발생했습니다.",
      };
    }
    return { data, success: response.ok };
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    return {
      data: null,
      success: false,
      message: "서버 내부 오류가 발생했습니다.",
    };
  }
}
