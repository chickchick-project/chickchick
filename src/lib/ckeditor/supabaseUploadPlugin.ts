import { Editor, FileLoader } from "ckeditor5";
import { getPostImageUrl } from "../supabase/query/posts";

class SupabaseUploadAdapter {
  loader: FileLoader;
  constructor(loader: FileLoader) {
    this.loader = loader;
  }
  async upload() {
    const file = await this.loader.file;
    if (!file) throw new Error("파일이 존재하지 않습니다.");
    const url = await getPostImageUrl(file);
    return { default: url };
  }
  abort() {}
}

export default function supabaseUploadPlugin(editor: Editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new SupabaseUploadAdapter(loader);
  };
}
