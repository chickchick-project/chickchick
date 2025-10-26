import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { createHttpClient } from "@/lib/utils/core-request";
import { PROFILE_BUCKET_NAME } from "@/lib/constants/buckets";
import {
  ApiResponse,
  UploadedImageInfo,
} from "@/lib/hono/schemas/common.schema";

interface ProfileImageUploadPayload {
  file: File;
}

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

export const updateUserProfile = (formData: ApiMyProfileResponse) => {
  return apiClient.patch(`/me`, formData);
};

export async function uploadProfileImage({ file }: ProfileImageUploadPayload) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucketName", PROFILE_BUCKET_NAME);

  const uploadResponse = await apiClient.post<ApiResponse<UploadedImageInfo>>(
    "/file/upload",
    formData
  );

  if (!uploadResponse?.success) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  const profilePayload = {
    imageUrl: uploadResponse.data.imageUrl,
  };

  // // 프로필 이미지 URL 업데이트
  const response = await apiClient.patch<
    { imageUrl: string },
    ApiResponse<ApiMyProfileResponse>
  >("/me", profilePayload);

  if (!response?.success) {
    throw new Error("프로필 이미지 업데이트에 실패했습니다.");
  }

  return response;
}
