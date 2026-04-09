"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ModalContainer } from "./ModalContainer";
import { meApi } from "@/client/utils/api/users.api";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/client/utils/queryKeys";

interface NicknameSetupModalProps {
  defaultNickname: string;
  closeModal: () => void;
}

export const NicknameSetupModal = ({
  defaultNickname,
  closeModal,
}: NicknameSetupModalProps) => {
  const { update } = useSession();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(defaultNickname);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleClose = async () => {
    // 닫아도 기본 닉네임으로 저장
    if (nickname === defaultNickname) {
      await applyNickname(defaultNickname);
    }
    closeModal();
  };

  const applyNickname = async (value: string) => {
    try {
      await meApi.profile.update({ nickname: value });
      await update({ isNewUser: false });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile("me") });
    } catch {
      // 저장 실패해도 모달은 닫힘 — 다음 로그인 시 재시도
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();

    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError("닉네임은 2자 이상 20자 이하로 입력해주세요.");
      return;
    }

    setIsPending(true);
    setError("");

    try {
      await applyNickname(trimmed);
      closeModal();
    } catch {
      setError("이미 사용 중인 닉네임입니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalContainer closeModal={handleClose} className="w-[360px] p-8">
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-2 font-bold text-black-100">
            닉네임 설정
          </h2>
          <p className="text-body-2 text-black-300">
            서비스에서 사용할 닉네임을 설정해주세요.
            <br />
            나중에 프로필에서 변경할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError("");
              }}
              maxLength={20}
              className="w-full px-4 py-3 border border-black-500 rounded-lg text-body-1 focus:outline-none focus:border-primary-200"
              autoFocus
            />
            {error && (
              <p className="text-label-1 text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-primary-200 text-white rounded-lg text-body-1 font-semibold disabled:opacity-50"
          >
            {isPending ? "저장 중..." : "시작하기"}
          </button>
        </form>
      </div>
    </ModalContainer>
  );
};
