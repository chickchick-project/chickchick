import { useState, useEffect, useRef, useMemo, MutableRefObject } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Alignment,
  AutoImage,
  Autosave,
  Bold,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  Strikethrough,
  Underline,
} from "ckeditor5";

import translations from "ckeditor5/translations/ko.js";
import makeLocalPreviewUploadPlugin, {
  BlobRegistry,
} from "@/lib/ckeditor/localPreviewUploadPlugin";

const LICENSE_KEY = "GPL";

export default function CkEditor5({
  content,
  onChange,
  blobRegistryRef,
}: {
  content?: string;
  onChange: (newContent: string) => void;
  blobRegistryRef: MutableRefObject<BlobRegistry>;
}) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const localPreviewPlugin = useMemo(
    () => makeLocalPreviewUploadPlugin(blobRegistryRef.current),
    [blobRegistryRef]
  );

  useEffect(() => {
    setIsLayoutReady(true);
    const blobRegistry = blobRegistryRef.current;

    return () => {
      for (const url of blobRegistry.keys()) {
        URL.revokeObjectURL(url);
      }
      blobRegistry.clear();
      setIsLayoutReady(false);
    };
  }, [blobRegistryRef]);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "imageUpload",
            "link",
            "|",
            "alignment",
            "|",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment,
          AutoImage,
          Autosave,
          Bold,
          Essentials,
          Heading,
          ImageBlock,
          ImageCaption,
          ImageEditing,
          ImageInline,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          Paragraph,
          Strikethrough,
          Underline,
          localPreviewPlugin,
        ],
        heading: {
          options: [
            {
              model: "paragraph" as const,
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading1" as const,
              view: "h1",
              title: "Heading 1",
              class: "ck-heading_heading1",
            },
            {
              model: "heading2" as const,
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3" as const,
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
          ],
        },
        image: {
          toolbar: [
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
            "|",
            "resizeImage",
          ],
        },
        initialData: content,
        language: "ko",
        licenseKey: LICENSE_KEY,
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: "https://",
          decorators: {
            toggleDownloadable: {
              mode: "manual" as const,
              label: "Downloadable",
              attributes: {
                download: "file",
              },
            },
          },
        },

        placeholder: "글 내용을 작성해 주세요.",
        translations: [translations],
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLayoutReady]);

  return (
    <div className="main-container">
      <div
        className="editor-container editor-container_classic-editor"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef}>
            {editorConfig && (
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                onChange={(event, editor) => {
                  if (!editor) return;
                  const data = editor.getData?.() ?? "";
                  onChange(data);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
