import { ImageFormat } from "@prisma/client";

const IMAGE_FORMAT_MAP: Record<string, ImageFormat> = {
  JPEG: ImageFormat.JPEG,
  JPG: ImageFormat.JPEG,
  PNG: ImageFormat.PNG,
  WEBP: ImageFormat.WEBP,
  HEIF: ImageFormat.HEIC,
  HEIC: ImageFormat.HEIC,
} as const;

/**
 * 이미지 형식을 가져옵니다.
 * @param formatString - 이미지 형식 문자열
 * @returns 이미지 형식
 */
export function getImageFormat(formatString?: string): ImageFormat {
  if (!formatString) return ImageFormat.UNKNOWN;
  return IMAGE_FORMAT_MAP[formatString.toUpperCase()] ?? ImageFormat.UNKNOWN;
}
