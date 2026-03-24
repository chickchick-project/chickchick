import type {
  ApiResponse,
  UploadedImageInfo,
} from "@/server/hono/schemas/common.schema";
import { apiClient } from "./client";
import { compressToWebP } from "@/client/utils/Compress";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

interface UploadOptions {
  compress?: boolean;
  quality?: number;
  ownerId?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const fileApi = {
  /**
   * 파일 업로드
   * @param file - 업로드할 파일 (File 또는 Blob)
   * @param bucketName - S3 버킷 이름 (예: "collection_image", "profile_image", "post_images")
   * @param options - 업로드 옵션 (압축 여부, 품질 등)
   * @throws 파일 타입 또는 크기가 유효하지 않을 경우 에러
   */
  upload: async (
    file: File | Blob,
    bucketName: string,
    options?: UploadOptions,
  ): Promise<ApiResponse<UploadedImageInfo>> => {
    const compress = options?.compress ?? true;

    // Blob인 경우 File로 변환
    let uploadFile: File =
      file instanceof File
        ? file
        : new File([file], "image.webp", { type: "image/webp" });

    // 원본 파일 타입 체크 (압축 전)
    const originalType = uploadFile.type;
    if (!ALLOWED_IMAGE_TYPES.includes(originalType as AllowedImageType)) {
      throw new Error(
        "지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF만 가능)",
      );
    }

    // 이미지 파일이고 압축 옵션이 활성화된 경우
    if (compress && uploadFile.type.startsWith("image/")) {
      // bucket별 기본 품질 설정
      const defaultQuality: Record<string, number> = {
        collection_image: 0.85, // 컬렉션: 높은 품질
        profile_image: 0.9, // 프로필: 최고 품질
        post_images: 0.8, // 게시글: 적당한 품질
      };

      const quality = options?.quality ?? defaultQuality[bucketName] ?? 0.85;

      try {
        const compressed = await compressToWebP(uploadFile, quality);

        uploadFile = new File(
          [compressed],
          uploadFile.name.replace(/\.[^.]+$/, ".webp"),
          { type: "image/webp" },
        );
      } catch (error) {
        // 압축 실패 시 원본 파일 사용
        console.warn("이미지 압축 실패, 원본 파일을 사용합니다:", error);
      }
    }

    // 압축 후 크기 체크
    if (uploadFile.size > MAX_FILE_SIZE) {
      throw new Error("파일 크기는 5MB 이하여야 합니다.");
    }

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("bucketName", bucketName);
    if (options?.ownerId) {
      formData.append("ownerId", options.ownerId);
    }

    const uploadResponse = await apiClient.post<ApiResponse<UploadedImageInfo>>(
      "/file/upload",
      formData,
    );

    if (!uploadResponse?.success) {
      throw new Error("파일 업로드에 실패했습니다.");
    }

    return uploadResponse;
  },
};
