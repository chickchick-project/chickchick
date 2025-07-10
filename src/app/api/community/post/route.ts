import { createCommunityPost } from "@/lib/queries/community/postQueries";
import { fetchCurrentUserInfo } from "@/lib/queries/userQueries";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await fetchCurrentUserInfo();
    const postFormData = await req.json();

    console.log("user", user);
    console.log("postFormData", postFormData);

    if (!user.data) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    if (
      !postFormData ||
      !postFormData.title ||
      !postFormData.content ||
      !postFormData.category
    ) {
      return NextResponse.json(
        { message: "필수 입력값이 누락되었습니다." },
        { status: 400 }
      );
    }

    const response = await createCommunityPost(user.data!.id, postFormData);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: error instanceof Error ? 500 : 400 }
    );
  }
}
