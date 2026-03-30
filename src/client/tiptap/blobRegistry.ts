import { fileApi } from "@/client/utils/api/files.api";
import { POST_IMAGES_BUCKET_NAME } from "@/shared/constants/buckets";

export type BlobRegistry = Map<string, File>;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function createBlobRegistry(): BlobRegistry {
  return new Map();
}

export function registerBlob(registry: BlobRegistry, file: File): string {
  const objectURL = URL.createObjectURL(file);
  registry.set(objectURL, file);
  return objectURL;
}

export function clearBlobRegistry(registry: BlobRegistry): void {
  for (const url of registry.keys()) {
    URL.revokeObjectURL(url);
  }
  registry.clear();
}

export async function finalizeContentWithBlobUpload(
  html: string,
  registry: BlobRegistry
): Promise<string> {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imgs = Array.from(doc.querySelectorAll("img[src^='blob:']"));

  for (const img of imgs) {
    const src = img.getAttribute("src")!;
    const file = registry.get(src);
    if (!file) continue;

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
