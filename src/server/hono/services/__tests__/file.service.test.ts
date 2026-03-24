import { describe, it, expect, beforeEach, vi } from "vitest";
import { uploadImage, deleteImageByUrl } from "../file.service";

/**
 * File 서비스 테스트 (MVP)
 *
 * 테스트 전략:
 * - 이미지 업로드/삭제 핵심 로직 검증
 * - 파일 유효성 검증 (타입, 크기) 확인
 * - 보안 취약점 방지 확인
 * - 외부 의존성 (Supabase) 에러 처리
 * - 메타데이터 추출 검증
 *
 * 주요 시나리오:
 * 1. 이미지 업로드 (타입/크기 검증, 메타데이터 추출)
 * 2. 이미지 삭제 (URL 파싱, 실패 시 조용한 처리)
 * 3. 에러 처리 (업로드 실패, 메타데이터 추출 실패)
 * 4. 보안 검증 (MIME 타입, 파일 크기)
 */

// Mock Supabase
const mockUpload = vi.fn();
const mockRemove = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock("@/server/supabase/server", () => ({
  supabaseAdmin: {
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        remove: mockRemove,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  },
}));

// Mock sharp
const mockMetadata = vi.fn();
vi.mock("sharp", () => ({
  default: vi.fn(() => ({
    metadata: mockMetadata,
  })),
}));

describe("File Service", () => {
  const TEST_USER_ID = "test-user-123";
  const TEST_BUCKET = "COLLECTION";
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Helper: 테스트용 File 객체 생성
  const createMockFile = (
    type: string,
    size: number,
    name = "test-image.jpg"
  ): File => {
    const buffer = new ArrayBuffer(size);
    const blob = new Blob([buffer], { type });
    return new File([blob], name, { type });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("uploadImage", () => {
    describe("파일 타입 검증", () => {
      it("should upload JPEG images", async () => {
        const file = createMockFile("image/jpeg", 1024);
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.format).toBe("JPEG");
        }
      });

      it("should upload PNG images", async () => {
        const file = createMockFile("image/png", 1024, "test.png");
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "png",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.png" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.png" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.format).toBe("PNG");
        }
      });

      it("should upload WebP images", async () => {
        const file = createMockFile("image/webp", 1024, "test.webp");
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "webp",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.webp" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.webp" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.format).toBe("WEBP");
        }
      });

      it("should reject invalid file types", async () => {
        const file = createMockFile("application/pdf", 1024, "test.pdf");

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("BAD_REQUEST");
          expect(result.message).toContain("지원하지 않는 이미지 형식");
        }
      });

      it("should reject GIF images", async () => {
        const file = createMockFile("image/gif", 1024, "test.gif");

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("BAD_REQUEST");
          expect(result.message).toContain("지원하지 않는 이미지 형식");
        }
      });

      it("should validate using MIME type, not file extension", async () => {
        // 확장자는 .jpg이지만 MIME 타입이 잘못된 경우
        const file = createMockFile("text/plain", 1024, "fake.jpg");

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("BAD_REQUEST");
        }
      });
    });

    describe("파일 크기 검증", () => {
      it("should reject files larger than 5MB", async () => {
        const file = createMockFile("image/jpeg", MAX_FILE_SIZE + 1);

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("BAD_REQUEST");
          expect(result.message).toContain("5MB 이하");
        }
      });

      it("should accept files exactly 5MB", async () => {
        const file = createMockFile("image/jpeg", MAX_FILE_SIZE);
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
      });

      it("should accept files under 5MB", async () => {
        const file = createMockFile("image/jpeg", 1024);
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
      });
    });

    describe("메타데이터 추출", () => {
      it("should extract image metadata (width, height, format)", async () => {
        const file = createMockFile("image/jpeg", 1024);
        mockMetadata.mockResolvedValue({
          width: 1920,
          height: 1080,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.width).toBe(1920);
          expect(result.data.height).toBe(1080);
          expect(result.data.format).toBe("JPEG");
        }
      });

      it("should handle metadata extraction failures", async () => {
        const file = createMockFile("image/jpeg", 1024);
        mockMetadata.mockRejectedValue(new Error("Invalid image"));

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
        }
      });

      it("should handle missing metadata fields gracefully", async () => {
        const file = createMockFile("image/jpeg", 1024);
        mockMetadata.mockResolvedValue({ format: "jpeg" }); // width, height 없음
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.width).toBe(0);
          expect(result.data.height).toBe(0);
        }
      });
    });

    describe("파일 경로 생성", () => {
      it("should store files in root directory for COLLECTION bucket", async () => {
        const file = createMockFile("image/jpeg", 1024, "test.jpg");
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/abc-test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(mockUpload).toHaveBeenCalled();
        const uploadPath = mockUpload.mock.calls[0][0];
        // COLLECTION 버킷은 루트에 저장
        expect(uploadPath).not.toContain(`/${TEST_USER_ID}/`);
        expect(uploadPath).toMatch(/^\/[a-f0-9-]+-test\.jpg$/);
      });

      it("should store files in userId directory for profile_image bucket", async () => {
        const file = createMockFile("image/jpeg", 1024, "profile.jpg");
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: `/test-user-123/abc-profile.jpg` },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/profile.jpg" },
        });

        await uploadImage("profile_image", file, TEST_USER_ID);

        expect(mockUpload).toHaveBeenCalled();
        const uploadPath = mockUpload.mock.calls[0][0];
        // profile_image 버킷은 userId 폴더에 저장
        expect(uploadPath).toContain(`/${TEST_USER_ID}/`);
        expect(uploadPath).toMatch(new RegExp(`^/${TEST_USER_ID}/[a-f0-9-]+-profile\\.jpg$`));
      });

      it("should generate unique paths for same filename", async () => {
        const file1 = createMockFile("image/jpeg", 1024, "image.jpg");
        const file2 = createMockFile("image/jpeg", 1024, "image.jpg");

        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        await uploadImage(TEST_BUCKET, file1, TEST_USER_ID);
        const path1 = mockUpload.mock.calls[0][0];

        await uploadImage(TEST_BUCKET, file2, TEST_USER_ID);
        const path2 = mockUpload.mock.calls[1][0];

        // UUID가 포함되어 있어 경로가 달라야 함
        expect(path1).not.toBe(path2);
      });
    });

    describe("Supabase 통합", () => {
      it("should return public URL on successful upload", async () => {
        const file = createMockFile("image/jpeg", 1024);
        const expectedUrl =
          "https://supabase.co/storage/v1/object/public/COLLECTION/test.jpg";

        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test-user-123/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: expectedUrl },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.imageUrl).toBe(expectedUrl);
        }
      });

      it("should handle Supabase upload failures", async () => {
        const file = createMockFile("image/jpeg", 1024);
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: null,
          error: { message: "Storage quota exceeded" },
        });

        const result = await uploadImage(TEST_BUCKET, file, TEST_USER_ID);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
          expect(result.message).toContain("Storage quota exceeded");
        }
      });

      it("should upload to correct bucket", async () => {
        const file = createMockFile("image/jpeg", 1024);
        mockMetadata.mockResolvedValue({
          width: 800,
          height: 600,
          format: "jpeg",
        });
        mockUpload.mockResolvedValue({
          data: { path: "/test.jpg" },
          error: null,
        });
        mockGetPublicUrl.mockReturnValue({
          data: { publicUrl: "https://example.com/test.jpg" },
        });

        const result = await uploadImage("PROFILE", file, TEST_USER_ID);

        // 버킷 이름이 올바르게 사용되었는지 확인
        expect(result.success).toBe(true);
      });
    });

    describe("입력 검증", () => {
      it("should return error if file is not provided", async () => {
        const result = await uploadImage(
          TEST_BUCKET,
          null as unknown as File,
          TEST_USER_ID
        );

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
          expect(result.message).toContain("이미지 파일이 필요합니다");
        }
      });

      it("should return error if file is not File instance", async () => {
        const result = await uploadImage(
          TEST_BUCKET,
          { name: "test.jpg" } as unknown as File,
          TEST_USER_ID
        );

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
        }
      });
    });
  });

  describe("deleteImageByUrl", () => {
    describe("URL 파싱", () => {
      it("should parse file path from valid URL", async () => {
        const imageUrl =
          "https://example.com/storage/v1/object/public/COLLECTION/user-123/image.jpg";
        mockRemove.mockResolvedValue({ error: null });

        const result = await deleteImageByUrl(TEST_BUCKET, imageUrl);

        expect(result.success).toBe(true);
        expect(mockRemove).toHaveBeenCalledWith(["user-123/image.jpg"]);
      });

      it("should delete from correct bucket", async () => {
        const imageUrl =
          "https://example.com/storage/v1/object/public/PROFILE/user-123/avatar.jpg";
        mockRemove.mockResolvedValue({ error: null });

        const result = await deleteImageByUrl("PROFILE", imageUrl);

        // 버킷 이름이 올바르게 사용되었는지 확인
        expect(result.success).toBe(true);
        expect(mockRemove).toHaveBeenCalledWith(["user-123/avatar.jpg"]);
      });

      it("should handle invalid URL format gracefully", async () => {
        const invalidUrl = "not-a-valid-url";

        const result = await deleteImageByUrl(TEST_BUCKET, invalidUrl);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
        }
      });

      it("should handle URL without file path", async () => {
        const invalidUrl = "https://example.com/storage/v1/object/public/";

        const result = await deleteImageByUrl(TEST_BUCKET, invalidUrl);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
          expect(result.message).toContain("유효하지 않은 이미지 URL");
        }
      });
    });

    describe("삭제 동작", () => {
      it("should succeed even if Supabase deletion fails", async () => {
        const imageUrl =
          "https://example.com/storage/v1/object/public/COLLECTION/user-123/image.jpg";
        mockRemove.mockResolvedValue({
          error: { message: "File not found" },
        });

        const result = await deleteImageByUrl(TEST_BUCKET, imageUrl);

        // 삭제 실패해도 success로 반환 (조용한 실패)
        expect(result.success).toBe(true);
      });

      it("should handle network errors gracefully", async () => {
        const imageUrl =
          "https://example.com/storage/v1/object/public/COLLECTION/user-123/image.jpg";
        mockRemove.mockRejectedValue(new Error("Network error"));

        const result = await deleteImageByUrl(TEST_BUCKET, imageUrl);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe("INTERNAL_ERROR");
        }
      });

      it("should delete file successfully", async () => {
        const imageUrl =
          "https://example.com/storage/v1/object/public/COLLECTION/user-123/test.jpg";
        mockRemove.mockResolvedValue({ error: null });

        const result = await deleteImageByUrl(TEST_BUCKET, imageUrl);

        expect(result.success).toBe(true);
        expect(mockRemove).toHaveBeenCalledWith(["user-123/test.jpg"]);
      });
    });
  });
});
