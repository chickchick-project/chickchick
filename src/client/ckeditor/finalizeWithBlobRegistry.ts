import type { BlobRegistry } from "@/client/ckeditor/localPreviewUploadPlugin";
import { fileApi } from "@/client/utils/api/files.api";
import { POST_IMAGES_BUCKET_NAME } from "@/shared/constants/buckets";

export async function finalizeWithBlobRegistry(
  html: string,
  registry: BlobRegistry
) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imgs = Array.from(doc.querySelectorAll("img[src^='blob:']"));

  for (const img of imgs) {
    const src = img.getAttribute("src")!;
    const file = registry.get(src);
    if (!file) {
      continue;
    }

    const result = await fileApi.upload(file, POST_IMAGES_BUCKET_NAME);

    if (!result.success || !result.data.imageUrl) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    img.setAttribute("src", result.data.imageUrl);
    URL.revokeObjectURL(src);
    registry.delete(src);
  }

  return doc.body.innerHTML;
}
