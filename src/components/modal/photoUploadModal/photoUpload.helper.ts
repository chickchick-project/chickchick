import { createHttpClient } from "@/lib/utils/core-request";
import type { PerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

interface PerfumeSearchResultData {
  data: PerfumeSimpleResponse[];
  totalCount: number;
  nextCursor: string | null;
}

export interface PerfumeSearchResponse {
  success: boolean;
  message: string;
  data: PerfumeSearchResultData;
}

interface UploadPayload {
  file: File;
  comment: string;
  perfume: PerfumeSimpleResponse;
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
  const formData = new FormData();
  formData.append("imageFile", file);
  formData.append("comment", comment);
  formData.append("perfumeId", perfume.id);

  const response = await apiClient.post("/me/collections", formData);

  if (response) {
    const event = new CustomEvent("collection-updated");
    window.dispatchEvent(event);
  }
}

export async function searchPerfumes(
  query: string
): Promise<PerfumeSearchResponse> {
  const response = await apiClient.get<PerfumeSearchResponse>(
    "/search/perfumes",
    { q: query }
  );

  if (!response) {
    return {
      success: false,
      message: "Failed to fetch results",
      data: {
        data: [],
        totalCount: 0,
        nextCursor: null,
      },
    };
  }

  return response;
}
