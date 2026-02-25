"use client";

import { ModalContainer } from "../ModalContainer";
import { ApiDraftResponse } from "@/lib/hono/schemas/draft.schema";

interface DraftRestoreModalProps {
  draft: ApiDraftResponse;
  onRestore: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInDays < 7) return `${diffInDays}일 전`;
  return date.toLocaleDateString("ko-KR");
};

export const DraftRestoreModal = ({
  draft,
  onRestore,
  onDiscard,
  onCancel,
}: DraftRestoreModalProps) => {
  const timeAgo = getTimeAgo(draft.updatedAt);

  return (
    <ModalContainer closeModal={onCancel}>
      <div className="flex flex-col w-[480px] p-8 gap-6">
        {/* 제목 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-black-300">
            임시 저장된 글이 있습니다
          </h2>
          <p className="text-sm text-gray-500">
            {timeAgo} 저장된 글을 불러올까요?
          </p>
        </div>

        {/* 임시 저장 내용 미리보기 */}
        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded">
              {draft.category}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(draft.updatedAt).toLocaleString("ko-KR")}
            </span>
          </div>

          {draft.title && (
            <h3 className="font-semibold text-black-300 line-clamp-1">
              {draft.title}
            </h3>
          )}

          {draft.contentText && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {draft.contentText}
            </p>
          )}

          {!draft.title && !draft.contentText && (
            <p className="text-sm text-gray-400 italic">내용 없음</p>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onRestore}
            className="w-full py-3 px-4 bg-primary-200 text-white font-medium rounded-lg hover:bg-primary-400 transition-colors"
          >
            임시 저장 불러오기
          </button>

          <button
            onClick={onDiscard}
            className="w-full py-3 px-4 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            삭제하고 새로 작성
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};
