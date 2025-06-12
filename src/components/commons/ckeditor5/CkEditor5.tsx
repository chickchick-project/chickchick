import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Alignment,
  AutoImage,
  Autosave,
  BalloonToolbar,
  Bold,
  CloudServices,
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
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  Strikethrough,
  Underline,
} from "ckeditor5";

import translations from "ckeditor5/translations/ko.js";
import supabaseUploadPlugin from "@/lib/ckeditor/supabaseUploadPlugin";

const LICENSE_KEY = "GPL";

export default function CkEditor5({
  content,
  onChange,
  id,
}: {
  content?: string;
  onChange: (newContent: string) => void;
  id: string;
}) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

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
          BalloonToolbar,
          Bold,
          CloudServices,
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
          ImageUtils,
          Indent,
          IndentBlock,
          Italic,
          Link,
          Paragraph,
          Strikethrough,
          Underline,
        ],
        extraPlugins: [supabaseUploadPlugin],
        balloonToolbar: ["bold", "italic", "|", "link"],
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
                id={id}
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
