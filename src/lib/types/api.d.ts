interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  nextCursor: string | null;
}

interface UploadedImageInfo {
  imageUrl: string;
  width: number;
  height: number;
  format: "JPEG" | "PNG" | "WEBP" | "HEIC" | "UNKNOWN";
}
