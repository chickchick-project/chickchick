import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { createHttpClient } from "@/lib/utils/core-request";

interface ProfileImageUploadPayload {
  file: File;
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

export const updateUserProfile = (formData: ApiMyProfileResponse) => {
  console.log(formData);
  return apiClient.patch(`/me/profile`, formData);
};

export async function uploadProfileImage({ file }: ProfileImageUploadPayload) {
  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await apiClient.post<ApiResponse<UploadedImageInfo>>(
    "/file/upload",
    formData
  );

  if (!uploadResponse?.success) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  const profileImagePayload = {
    imageInfo: uploadResponse.data,
  };
  const response = await apiClient.post(
    "/me/profile-image",
    profileImagePayload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}
