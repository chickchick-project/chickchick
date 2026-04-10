"use client";

import { useSession } from "next-auth/react";
import { ModalContainer } from "./ModalContainer";
import Image from "next/image";
import IMAGES from "@/shared/constants/images";

const PROVIDER_META: Record<string, { label: string; imageKey: string; width: number; height: number }> = {
  google: { label: "구글", imageKey: "Google", width: 32, height: 32 },
  naver: { label: "네이버", imageKey: "Naver", width: 48, height: 48 },
  kakao: { label: "카카오", imageKey: "Kakao", width: 32, height: 32 },
};

interface AccountLinkedModalProps {
  provider: string;
  closeModal: () => void;
}

export const AccountLinkedModal = ({ provider, closeModal }: AccountLinkedModalProps) => {
  const { update } = useSession();

  const handleClose = async () => {
    await update({ isLinked: false });
    closeModal();
  };

  const meta = PROVIDER_META[provider];

  return (
    <ModalContainer closeModal={handleClose} className="w-[360px] p-8">
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col items-center gap-4">
          {meta && (
            <Image
              src={IMAGES[meta.imageKey].src}
              alt={IMAGES[meta.imageKey].alt}
              width={meta.width}
              height={meta.height}
            />
          )}
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-heading-2 font-bold text-black-100">
              기존 계정에 연결되었어요
            </h2>
            <p className="text-body-2 text-black-300">
              이미 같은 이메일로 가입된 계정이 있어요.
              <br />
              {meta ? `${meta.label} 계정이 기존 계정에 연결되었습니다.` : "소셜 계정이 기존 계정에 연결되었습니다."}
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 bg-primary-200 text-white rounded-lg text-body-1 font-semibold"
        >
          확인
        </button>
      </div>
    </ModalContainer>
  );
};
