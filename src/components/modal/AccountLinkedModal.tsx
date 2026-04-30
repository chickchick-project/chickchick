"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { ModalContainer } from "./ModalContainer";
import Image from "next/image";
import IMAGES from "@/shared/constants/images";

const PROVIDER_META: Record<
  string,
  { label: string; imageKey: string; width: number; height: number }
> = {
  google: { label: "구글", imageKey: "Google", width: 32, height: 32 },
  naver: { label: "네이버", imageKey: "Naver", width: 48, height: 48 },
  kakao: { label: "카카오", imageKey: "Kakao", width: 32, height: 32 },
};

interface AccountLinkedModalProps {
  provider: string;
  mode: "confirm" | "linked";
  token?: string;
  closeModal: () => void;
}

export const AccountLinkedModal = ({
  provider,
  mode,
  token,
  closeModal,
}: AccountLinkedModalProps) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const meta = PROVIDER_META[provider];

  const handleConfirm = async () => {
    if (!token) return;
    setIsPending(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/confirm-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.message ?? "연결에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      // 연결 완료 후 해당 provider로 재로그인
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      setError("연결에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsPending(false);
    }
  };

  if (mode === "confirm") {
    return (
      <ModalContainer closeModal={closeModal} className="w-[360px] p-8">
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
                이미 가입된 이메일이에요
              </h2>
              <p className="text-body-2 text-black-300">
                같은 이메일로 가입된 계정이 있어요.
                <br />
                {meta
                  ? `${meta.label} 계정을 기존 계정에 연결하시겠어요?`
                  : "이 소셜 계정을 기존 계정에 연결하시겠어요?"}
              </p>
            </div>
          </div>

          {error && (
            <p className="text-label-4 text-red text-center">{error}</p>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={handleConfirm}
              disabled={isPending}
              className="w-full py-3 bg-primary-200 text-white rounded-lg text-body-1 font-semibold disabled:opacity-50"
            >
              {isPending ? "연결 중..." : "연결하기"}
            </button>
            <button
              onClick={closeModal}
              disabled={isPending}
              className="w-full py-3 bg-white text-black-300 border border-gray-300 rounded-lg text-body-1 font-semibold disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      </ModalContainer>
    );
  }

  // mode === "linked" (설정 페이지에서 연결 완료 후 알림용으로 유지)
  return (
    <ModalContainer closeModal={closeModal} className="w-[360px] p-8">
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
              {meta
                ? `${meta.label} 계정이 기존 계정에 연결되었습니다.`
                : "소셜 계정이 기존 계정에 연결되었습니다."}
            </p>
          </div>
        </div>

        <button
          onClick={closeModal}
          className="w-full py-3 bg-primary-200 text-white rounded-lg text-body-1 font-semibold"
        >
          확인
        </button>
      </div>
    </ModalContainer>
  );
};
