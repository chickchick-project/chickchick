import { BlobRegistry } from "@/lib/ckeditor/localPreviewUploadPlugin";
import {
  POST_IMAGE_MAX_SIZE,
  getPostImageUrl,
} from "@/lib/queries/community/postsImageUrl";

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

    if (file.size > POST_IMAGE_MAX_SIZE) {
      throw new Error("5MB 이하 이미지 파일만 업로드할 수 있습니다.");
    }

    const url = await getPostImageUrl(file);
    if (!url) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    img.setAttribute("src", url);
    URL.revokeObjectURL(src);
    registry.delete(src);
  }

  return doc.body.innerHTML;
}
