"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ActionItem, Actions } from "@/components/commons/actions";
import { usePostMutation } from "@/client/hooks/query/useCommunityQuery";
import {
  useDraftByType,
  useDeleteDraft,
} from "@/client/hooks/query/useDraftQuery";
import { DraftType } from "@prisma/client";
import { DraftRestoreModal } from "@/components/modal/draftRestoreModal";

interface PostActionsProps {
  section?: "header" | "content";
  postId: string;
}

export default function PostActions({
  section = "header",
  postId,
}: PostActionsProps) {
  const router = useRouter();
  const { deleteMutation } = usePostMutation(postId);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);
  const [checkDraft, setCheckDraft] = useState(false);

  // header section에서만 draft 체크 수행 (중복 방지)
  const shouldCheckDraft = section === "header" && checkDraft;

  const { data: updateDraft, isFetched } = useDraftByType(
    DraftType.UPDATE,
    shouldCheckDraft,
  );
  const deleteDraftMutation = useDeleteDraft();

  // draft 확인이 완료되면 처리
  useEffect(() => {
    // header section에서만 처리
    if (section === "header" && checkDraft && isFetched) {
      if (updateDraft) {
        // UPDATE draft가 있는 경우
        if (updateDraft.postId === postId) {
          // 같은 게시글의 draft - 복원 모달 표시
          setHasConflict(false);
          setShowDraftModal(true);
        } else {
          // 다른 게시글의 draft - 충돌 모달 표시
          setHasConflict(true);
          setShowDraftModal(true);
        }
      } else {
        // UPDATE draft가 없으면 바로 수정 페이지로 이동
        router.push(`/community/post/${postId}/edit`);
      }
      // draft 확인 완료 후 상태 초기화
      setCheckDraft(false);
    }
  }, [section, checkDraft, isFetched, updateDraft, router, postId]);

  const handleEditClick = (e?: React.MouseEvent) => {
    // 이벤트 전파 방지 (버블링, 기본 동작 방지)
    e?.preventDefault();
    e?.stopPropagation();

    // 수정 버튼 클릭 시에만 draft 확인 시작
    setCheckDraft(true);
  };

  const handleRestoreDraft = () => {
    if (updateDraft) {
      // 임시 저장 데이터를 쿼리 파라미터로 전달
      router.push(`/community/post/${postId}/edit?draftId=${updateDraft.id}`);
    }
    setShowDraftModal(false);
  };

  const handleDiscardDraft = async () => {
    try {
      if (!updateDraft) {
        setShowDraftModal(false);
        setHasConflict(false);
        router.push(`/community/post/${postId}/edit`);
        return;
      }

      // draft 삭제 완료를 기다림
      await deleteDraftMutation.mutateAsync(updateDraft.id);

      setShowDraftModal(false);
      setHasConflict(false);

      // 약간의 지연을 추가하여 캐시 무효화가 완료되도록 함
      await new Promise((resolve) => setTimeout(resolve, 100));

      // draft 삭제가 완전히 완료된 후 수정 페이지로 이동
      // skipDraftCheck 플래그를 전달하여 PageClient에서 draft 조회 비활성화
      router.push(`/community/post/${postId}/edit?skipDraftCheck=true`);
    } catch {
      // 오류 발생 시에도 모달 닫기
      setShowDraftModal(false);
      setHasConflict(false);
    }
  };

  const handleCancelModal = () => {
    setShowDraftModal(false);
    setHasConflict(false);
    // 모달만 닫기 (페이지 이동 없음)
  };

  const handleDeletePost = (e?: React.MouseEvent) => {
    // 이벤트 전파 방지
    e?.preventDefault();
    e?.stopPropagation();

    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      //모달로 교체 예정
      deleteMutation.mutate();
    }
  };

  const actions: ActionItem[] = [
    {
      type: "edit",
      label: "수정",
      onClick: handleEditClick,
    },
    {
      type: "delete",
      label: "삭제",
      onClick: handleDeletePost,
      disabled: deleteMutation.isPending,
    },
  ];

  const display =
    section === "header" ? "hidden tablet:block" : "block tablet:hidden";
  return (
    <>
      {/* 모달은 header section에서만 렌더링 (중복 방지) */}
      {section === "header" && showDraftModal && updateDraft && (
        <DraftRestoreModal
          draft={updateDraft}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
          onCancel={handleCancelModal}
          hasConflict={hasConflict}
        />
      )}

      <div className={display}>
        <Actions actions={actions} />
      </div>
    </>
  );
}
