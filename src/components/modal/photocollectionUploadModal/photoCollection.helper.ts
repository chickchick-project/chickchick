import { createHttpClient } from "@/lib/utils/core-request";
import type { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

type SearchResponse = PaginatedResponse<ApiPerfumeSimpleResponse>;

type RawApiResponse = ApiResponse<SearchResponse>;

interface UploadPayload {
  file: File;
  comment: string;
  perfume: ApiPerfumeSimpleResponse;
}

interface UploadedImageInfo {
  imageUrl: string;
  width: number;
  height: number;
  format: "JPEG" | "PNG" | "WEBP" | "HEIC" | "UNKNOWN";
}

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

export async function uploadPhotoCollection({
  file,
  comment,
  perfume,
}: UploadPayload) {
  // 1단계: 파일 업로드
  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await apiClient.post<ApiResponse<UploadedImageInfo>>(
    "/file/upload",
    formData
  );

  if (!uploadResponse?.success) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  // 2단계: 컬렉션 생성 (JSON 요청)
  const collectionPayload = {
    perfumeId: perfume.id,
    comment: comment || undefined,
    imageInfo: uploadResponse.data,
  };

  const response = await apiClient.post("/me/collections", collectionPayload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response) {
    const event = new CustomEvent("collection-updated");
    window.dispatchEvent(event);
  }

  return response;
}

export async function searchPerfumeTags(
  query: string
): Promise<SearchResponse> {
  const response = await apiClient.get<RawApiResponse>("/search/perfumes", {
    q: query,
  });

  if (!response?.success) {
    throw new Error(
      response?.message || "향수 정보를 불러오는 데 실패했습니다."
    );
  }

  return response.data;
}
