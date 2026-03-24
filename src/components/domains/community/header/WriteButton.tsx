"use client";

import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import { NAV_PATHS } from "@/components/commons/navBar/navBar.constants";
import ICONS from "@/shared/constants/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DraftRestoreModal } from "@/components/modal/draftRestoreModal";
import {
  useDraftByType,
  useDeleteDraft,
} from "@/client/hooks/query/useDraftQuery";
import { DraftType } from "@prisma/client";

export default function WriteButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [checkDraft, setCheckDraft] = useState(false);
  const { data: createDraft, isFetched } = useDraftByType(
    DraftType.CREATE,
    checkDraft,
  );
  const deleteDraftMutation = useDeleteDraft();

  // draft 확인이 완료되면 처리
  useEffect(() => {
    if (checkDraft && isFetched) {
      if (createDraft) {
        // CREATE 타입 임시 저장이 있으면 모달 표시
        setShowModal(true);
      } else {
        // 없으면 바로 글쓰기 페이지로 이동
        router.push(NAV_PATHS.POST);
      }
      // draft 확인 완료 후 상태 초기화
      setCheckDraft(false);
    }
  }, [checkDraft, isFetched, createDraft, router]);

  const handleWriteClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 글쓰기 버튼 클릭 시에만 draft 확인 시작
    setCheckDraft(true);
  };

  const handleRestore = () => {
    if (createDraft) {
      // 임시 저장 데이터를 쿼리 파라미터로 전달
      router.push(`${NAV_PATHS.POST}?draftId=${createDraft.id}`);
    }
    setShowModal(false);
  };

  const handleDiscard = async () => {
    if (createDraft) {
      await deleteDraftMutation.mutateAsync(createDraft.id);
    }
    setShowModal(false);
    router.push(NAV_PATHS.POST);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

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

      {showModal && createDraft && (
        <DraftRestoreModal
          draft={createDraft}
          onRestore={handleRestore}
          onDiscard={handleDiscard}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
