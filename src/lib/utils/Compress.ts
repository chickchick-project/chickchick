/**
 * 라이브러리 없이 브라우저 내장 API만 사용하여
 * 이미지를 WebP 포맷으로 변환 및 압축하는 유틸리티
 */
export const compressToWebP = (file: File, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Canvas context를 생성할 수 없습니다."));
        }

        // 원본 해상도 유지 (필요 시 여기서 maxWidth 조절 가능)
        canvas.width = img.width;
        canvas.height = img.height;

        // 캔버스에 이미지 그리기
        ctx.drawImage(img, 0, 0);

        // WebP 포맷으로 변환 및 압축
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("WebP 변환에 실패했습니다."));
          },
          "image/webp",
          quality,
        );
      };

      img.onerror = () =>
        reject(new Error("이미지 로드 중 에러가 발생했습니다."));
    };

    reader.onerror = () =>
      reject(new Error("파일 읽기 중 에러가 발생했습니다."));
  });
};
