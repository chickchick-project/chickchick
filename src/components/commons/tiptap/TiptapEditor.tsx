"use client";

import { useEffect, useRef, MutableRefObject, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

import {
  BlobRegistry,
  MAX_IMAGE_SIZE,
  registerBlob,
  clearBlobRegistry,
} from "@/client/tiptap/blobRegistry";
import TiptapToolbar from "./TiptapToolbar";

interface TiptapEditorProps {
  content?: string;
  onChange: (html: string) => void;
  blobRegistryRef: MutableRefObject<BlobRegistry>;
}

export default function TiptapEditor({
  content,
  onChange,
  blobRegistryRef,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        defaultProtocol: "https",
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ allowBase64: false }),
    ],
    content: content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] tablet:min-h-[600px] outline-none px-4 py-3",
        "data-placeholder": "글 내용을 작성해 주세요.",
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;

            if (file.size > MAX_IMAGE_SIZE) {
              alert("5MB 이하 이미지 파일만 업로드할 수 있습니다.");
              return true;
            }

            const src = registerBlob(blobRegistryRef.current, file);
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src })
              )
            );
            return true;
          }
        }
        return false;
      },
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;

        const file = files[0];
        if (!file.type.startsWith("image/")) return false;

        if (file.size > MAX_IMAGE_SIZE) {
          alert("5MB 이하 이미지 파일만 업로드할 수 있습니다.");
          return true;
        }

        const src = registerBlob(blobRegistryRef.current, file);
        const { schema } = view.state;
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        if (!coordinates) return false;

        const node = schema.nodes.image.create({ src });
        const transaction = view.state.tr.insert(coordinates.pos, node);
        view.dispatch(transaction);
        return true;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // 외부에서 content가 변경될 때 (예: draft 로드) 에디터 내용 동기화
  useEffect(() => {
    if (!editor || content === undefined) return;
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  // 언마운트 시 blob URL 정리
  useEffect(() => {
    const registry = blobRegistryRef.current;
    return () => {
      clearBlobRegistry(registry);
    };
  }, [blobRegistryRef]);

  const handleImageUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (file.size > MAX_IMAGE_SIZE) {
        alert("5MB 이하 이미지 파일만 업로드할 수 있습니다.");
        return;
      }

      const src = registerBlob(blobRegistryRef.current, file);
      editor.chain().focus().setImage({ src }).run();
      e.target.value = "";
    },
    [editor, blobRegistryRef]
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <TiptapToolbar editor={editor} onImageUpload={handleImageUploadClick} />
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
