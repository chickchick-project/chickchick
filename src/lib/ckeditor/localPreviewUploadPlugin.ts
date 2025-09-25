import { Editor, FileLoader } from "ckeditor5";
import { POST_IMAGE_MAX_SIZE } from "../queries/community/postsImageUrl";

export type BlobRegistry = Map<string, File>;

class LocalPreviewAdapter {
  private loader: FileLoader;
  private registry: BlobRegistry;

  constructor(loader: FileLoader, registry: BlobRegistry) {
    this.loader = loader;
    this.registry = registry;
  }

  async upload() {
    const file = await this.loader.file;
    if (!file) throw new Error("파일이 존재하지 않습니다.");
    if (file.size > POST_IMAGE_MAX_SIZE) {
      return Promise.reject("5MB 이하 이미지 파일만 업로드할 수 있습니다.");
    }

    const objectURL = URL.createObjectURL(file);
    this.registry.set(objectURL, file);
    return { default: objectURL };
  }

  abort() {}
}

export default function makeLocalPreviewUploadPlugin(registry: BlobRegistry) {
  return function localPreviewUploadPlugin(editor: Editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: FileLoader
    ) => new LocalPreviewAdapter(loader, registry);
  };
}
