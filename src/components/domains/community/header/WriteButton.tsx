"use client";

import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import { NAV_PATHS } from "@/components/commons/navBar/navBar.constants";
import ICONS from "@/lib/constants/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DraftRestoreModal } from "@/components/modal/draftRestoreModal";
import { useDraftList, useDeleteDraft } from "@/lib/hooks/query/useDraftQuery";
import { ApiDraftResponse } from "@/lib/hono/schemas/draft.schema";

export default function WriteButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const { data: draftListResponse } = useDraftList();
  const deleteDraftMutation = useDeleteDraft();

  const handleWriteClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 임시 저장된 글이 있는지 확인 (postId가 null인 새 게시글 임시 저장)
    const newPostDraft = draftListResponse?.find(
      (draft: ApiDraftResponse) => draft.postId === null
    );

    if (newPostDraft) {
      // 임시 저장이 있으면 모달 표시
      setShowModal(true);
    } else {
      // 없으면 바로 글쓰기 페이지로 이동
      router.push(NAV_PATHS.POST);
    }
  };

  const handleRestore = () => {
    const newPostDraft = draftListResponse?.find(
      (draft: ApiDraftResponse) => draft.postId === null
    );
    if (newPostDraft) {
      // 임시 저장 데이터를 쿼리 파라미터로 전달
      router.push(`${NAV_PATHS.POST}?draftId=${newPostDraft.id}`);
    }
    setShowModal(false);
  };

  const handleDiscard = async () => {
    const newPostDraft = draftListResponse?.find(
      (draft: ApiDraftResponse) => draft.postId === null
    );
    if (newPostDraft) {
      await deleteDraftMutation.mutateAsync(newPostDraft.id);
    }
    setShowModal(false);
    router.push(NAV_PATHS.POST);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const newPostDraft = draftListResponse?.find(
    (draft: ApiDraftResponse) => draft.postId === null
  );

  return (
    <>
      <div className="hidden tablet:block" onClick={handleWriteClick}>
        <ButtonOutlinedPrimaryLFit
          iconLeading={
            <Image
              src={ICONS.Pen.src}
              alt={ICONS.Pen.alt}
              width={20}
              height={20}
            />
          }
        >
          글쓰기
        </ButtonOutlinedPrimaryLFit>
      </div>

      {showModal && newPostDraft && (
        <DraftRestoreModal
          draft={newPostDraft}
          onRestore={handleRestore}
          onDiscard={handleDiscard}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
