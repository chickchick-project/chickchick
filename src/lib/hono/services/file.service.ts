import sharp from "sharp";
import {
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
} from "../utils/serviceResult.utils";
import { getImageFormat } from "../utils/service.utils";
import { supabaseAdmin } from "@/lib/supabase/server";

export interface UploadedImageInfo {
  imageUrl: string;
  width: number;
  height: number;
  format: string; // 혹은 enum 타입
}

const filePath = (userId: string, file: File) =>
  `/${userId}/${crypto.randomUUID()}-${file.name}`;

/**
 * 사용자 컬렉션 이미지를 Supabase Storage에 업로드합니다.
 * @param storageBucketName - 스토리지 버킷 이름
 * @param file - 업로드할 이미지 파일
 * @param userId - 파일을 업로드하는 사용자 ID (파일 경로 생성에 사용)
 * @returns ServiceResult<UploadedImageInfo>
 */
export async function uploadImage(
  storageBucketName: string,
  file: File,
  userId: string
): Promise<ServiceResult<UploadedImageInfo>> {
  if (!file || !(file instanceof File)) {
    return serviceInternalError(new Error("이미지 파일이 필요합니다."));
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(fileBuffer).metadata();
    const imageFormat = getImageFormat(metadata.format);
    const newFilePath = filePath(userId, file);

    // 1. 파일 업로드
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from(storageBucketName)
      .upload(newFilePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      return serviceInternalError(uploadError.message);
    }

    // 2. 퍼블릭 URL 가져오기
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(storageBucketName).getPublicUrl(data.path);

    const uploadedInfo: UploadedImageInfo = {
      imageUrl: publicUrl,
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: imageFormat,
    };

    return serviceSuccess(uploadedInfo);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "파일 처리 중 알 수 없는 오류가 발생했습니다.";
    return serviceInternalError(message);
  }
}

/**
 * 이미지 URL을 기반으로 Supabase Storage에서 파일을 삭제합니다.
 * @param imageUrl - 삭제할 이미지의 Public URL
 * @returns ServiceResult<void>
 */
export async function deleteImageByUrl(
  storageBucketName: string,
  imageUrl: string
): Promise<ServiceResult<void>> {
  try {
    const filePath = new URL(imageUrl).pathname.split(
      `/public/${storageBucketName}/`
    )[1];
    if (!filePath) {
      return serviceInternalError("유효하지 않은 이미지 URL입니다.");
    }

    const { error } = await supabaseAdmin.storage
      .from(storageBucketName)
      .remove([filePath]);

    if (error) {
      console.warn(`파일 삭제 실패: ${filePath}`, error.message);
    }
    return serviceSuccess(undefined);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "파일 삭제 중 알 수 없는 오류가 발생했습니다.";
    return serviceInternalError(message);
  }
}
