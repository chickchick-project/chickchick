import { ApiResponse, UploadedImageInfo } from "@/lib/hono/schemas/common.schema";
import { apiClient } from "./client";

export const fileApi = {
  /**
   * 파일 업로드
   * @param file - 업로드할 파일
   * @param bucketName - S3 버킷 이름 (예: "collection_image", "profile_image")
   */
  upload: async (
    file: File,
    bucketName: string
  ): Promise<ApiResponse<UploadedImageInfo>> => {
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
