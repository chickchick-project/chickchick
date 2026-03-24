"use client";

import { ModalContainer } from "../ModalContainer";
import { ApiDraftResponse } from "@/server/hono/schemas/draft.schema";
import { DraftType } from "@prisma/client";
import { BOARD_OPTIONS } from "@/shared/constants/options";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface DraftRestoreModalProps {
  draft: ApiDraftResponse;
  onRestore: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  hasConflict?: boolean;
}

const getTimeAgo = (dateString: string): string => {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffInDays = now.diff(date, "day");

  if (diffInDays >= 7) {
    return date.format("YYYY. MM. DD");
  }
  return date.fromNow();
};

export const DraftRestoreModal = ({
  draft,
  onRestore,
  onDiscard,
  onCancel,
  hasConflict = false,
}: DraftRestoreModalProps) => {
  const timeAgo = getTimeAgo(draft.updatedAt);
  const draftTypeLabel =
    draft.type === DraftType.CREATE ? "작성 중이던" : "수정 중이던";
  const categoryLabel =
    BOARD_OPTIONS.find((option) => option.value === draft.category)?.label ||
    draft.category;
  const descriptionText =
    draft.type === DraftType.CREATE
      ? `${timeAgo}에 저장된 글을 불러올까요?`
      : `${timeAgo}에 저장된 임시 저장 데이터가 있습니다.`;

  return (
    <ModalContainer closeModal={onCancel}>
      <div className="flex flex-col w-[480px] p-8 gap-6">
        {/* 제목 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-black-300">
            {draftTypeLabel} 글이 있습니다
          </h2>
          <p className="text-sm text-gray-500">{descriptionText}</p>
        </div>

        {/* 임시 저장 내용 미리보기 */}
        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-600 rounded">
              {categoryLabel}
            </span>
            <span className="text-xs text-gray-400">
              {dayjs(draft.updatedAt).format("YYYY. MM. DD. A h:mm")}
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
          {/* 충돌 상황이 아닐 때만 불러오기 버튼 표시 */}
          {!hasConflict && (
            <button
              onClick={onRestore}
              className="w-full py-3 px-4 bg-primary-200 text-white font-medium rounded-lg hover:bg-primary-400 transition-colors"
            >
              임시 저장 불러오기
            </button>
          )}

          {/* 충돌 상황일 때는 "삭제하고 수정하기", 아니면 "삭제하고 새로 작성" */}
          <button
            onClick={onDiscard}
            className="w-full py-3 px-4 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
          >
            {hasConflict
              ? "삭제하고 수정하기"
              : `삭제하고 ${draft.type === DraftType.CREATE ? "새로 작성" : "수정하기"}`}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};
