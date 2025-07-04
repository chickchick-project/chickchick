import { getPostDetailByIdService } from "@/lib/queries/community/postQueries";
import { fetchCurrentUserInfo } from "@/lib/queries/userQueries";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UuidSchema = z.string().uuid({ message: "유효하지 않은 ID 형식입니다." });
//hono로 변경 예정
export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (!id) {
    return NextResponse.json(
      { message: "게시글 ID가 필요합니다." },
      { status: 400 }
    );
  }

  const validationResult = UuidSchema.safeParse(id);

  if (!validationResult.success) {
    return NextResponse.json(
      { message: validationResult.error.errors[0].message },
      { status: 400 }
    );
  }

  try {
    // 현재로그인한 유저 정보 조회 수정 예정(추후에 쿠키에서 토큰을 가져와서 처리 or 서버에서 세션을 가져와서 처리)
    const user = await fetchCurrentUserInfo();
    const userId = user?.data?.id ? user?.data?.id : null;
    console.log("fetchCurrentUserInfo", userId, id);
    const postDetail = await getPostDetailByIdService(userId, id);

    if (!postDetail) {
      return NextResponse.json(
        { message: "해당 게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(postDetail);
  } catch (error) {
    console.error(`API Error fetching post ${id}:`, error);
    return NextResponse.json(
      { message: (error as Error).message || "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
