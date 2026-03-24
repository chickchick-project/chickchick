import { Editor, FileLoader } from "ckeditor5";
import { fileApi } from "@/client/utils/api/files.api";
import { POST_IMAGES_BUCKET_NAME } from "@/shared/constants/buckets";

class SupabaseUploadAdapter {
  loader: FileLoader;
  constructor(loader: FileLoader) {
    this.loader = loader;
  }
  async upload() {
    const file = await this.loader.file;
    if (!file) throw new Error("파일이 존재하지 않습니다.");

    try {
      const result = await fileApi.upload(file, POST_IMAGES_BUCKET_NAME);
      if (!result.success || !result.data.imageUrl) {
        return Promise.reject("이미지 업로드에 실패했습니다.");
      }
      return { default: result.data.imageUrl };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "이미지 업로드에 실패했습니다.";
      return Promise.reject(message);
    }
  }
  abort() {}
}

export default function supabaseUploadPlugin(editor: Editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new SupabaseUploadAdapter(loader);
  };
}
