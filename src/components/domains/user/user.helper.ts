import { createHttpClient } from "@/lib/utils/core-request";
import { UserCollection } from "@prisma/client";
import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";
import { prisma } from "@/lib/prisma";

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

// 인증 쿠키를 포함하도록 request 인터셉터 추가
apiClient.useRequestInterceptor((config) => {
  return {
    ...config,
    credentials: "include",
  };
});

export async function fetchUserCollections(
  userId: string
): Promise<ApiSuccessResponse<UserCollection[]>> {
  const response = await prisma.userCollection.findMany({
    where: {
      userId,
    },
    include: {
      image: true,
    },
  });
  // const result = await apiClient.get<ApiSuccessResponse<UserCollection[]>>(
  //   `/users/${userId}/collections`
  // );

  return {
    success: true,
    message: "컬렉션 조회에 성공했습니다.",
    data: response,
  };
}
