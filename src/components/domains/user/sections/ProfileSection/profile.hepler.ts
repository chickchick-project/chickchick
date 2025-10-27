import { ApiUpdateMyProfileRequest } from "@/lib/hono/schemas/me.schema";
import { PROFILE_BUCKET_NAME } from "@/lib/constants/buckets";
import { meApi } from "@/lib/utils/api/users.api";
import { fileApi } from "@/lib/utils/api/files.api";

interface ProfileImageUploadPayload {
  file: File;
}

/**
 * 사용자 프로필 정보 업데이트
 */
export const updateUserProfile = (formData: ApiUpdateMyProfileRequest) => {
  return meApi.profile.update(formData);
};

/**
 * 프로필 이미지 업로드 및 프로필 업데이트
 */
export async function uploadProfileImage({ file }: ProfileImageUploadPayload) {
  // 파일 업로드
  const uploadResponse = await fileApi.upload(file, PROFILE_BUCKET_NAME);

  if (!uploadResponse?.success) {
    throw new Error("파일 업로드에 실패했습니다.");
  }

  const profilePayload = {
    imageUrl: uploadResponse.data.imageUrl,
  };

  // 프로필 이미지 URL 업데이트
  const response = await meApi.profile.update(profilePayload);

  if (!response?.success) {
    throw new Error("프로필 이미지 업데이트에 실패했습니다.");
  }

  return response;
}
