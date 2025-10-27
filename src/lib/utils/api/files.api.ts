import {
  ApiResponse,
  UploadedImageInfo,
} from "@/lib/hono/schemas/common.schema";
import { apiClient } from "./client";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const fileApi = {
  /**
   * 파일 업로드
   * @param file - 업로드할 파일
   * @param bucketName - S3 버킷 이름 (예: "collection_image", "profile_image", "post_images")
   * @throws 파일 타입 또는 크기가 유효하지 않을 경우 에러
   */
  upload: async (
    file: File,
    bucketName: string
  ): Promise<ApiResponse<UploadedImageInfo>> => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
      throw new Error(
        "지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF만 가능)"
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("파일 크기는 5MB 이하여야 합니다.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucketName", bucketName);

    const uploadResponse = await apiClient.post<ApiResponse<UploadedImageInfo>>(
      "/file/upload",
      formData
    );

    if (!uploadResponse?.success) {
      throw new Error("파일 업로드에 실패했습니다.");
    }

    return uploadResponse;
  },
};
