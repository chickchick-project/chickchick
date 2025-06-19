import { TPostCreateInput } from "@/lib/queries/community/postQueries";

export async function submitPost(postFormData: TPostCreateInput) {
  try {
    const response = await fetch("/api/community/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postFormData }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();
    console.log("게시글 작성 성공:", data);
    // 게시글 상세페이지로 리다이렉트 처리 필요
    return data;
  } catch (error) {
    console.error("게시글 작성 에러:", error);
  }
}
