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
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const DEFAULT_NICKNAME_NOTICE =
    "닉네임을 수정하지 않으면 기본값이 사용됩니다.";
  const handleClose = async () => {
    try {
      if (defaultNickname) {
        await applyNickname(defaultNickname);
      } else {
        await update({ isNewUser: false });
      }
    } catch {
      // 저장 실패해도 모달은 닫힘 — 다음 로그인 시 재시도
    }
    closeModal();
  };

  const applyNickname = async (value: string) => {
    await meApi.profile.update({ nickname: value });
    await update({ isNewUser: false });
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile("me") });
  };

  const getValidationError = (value: string) => {
    if (!value) return "";
    if (value.length < 2)
      return "닉네임은 한글 2글자 이상, 영문 3글자 이상만 입력 가능합니다.";
    return "";
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError(getValidationError(value));
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
    <ModalContainer
      closeModal={handleClose}
      title="닉네임 설정"
      className="w-[360px]"
    >
      <div className="flex flex-col gap-6 px-6 pb-6">
        <p className="text-body-2 text-black-300">
          서비스에서 사용할 닉네임을 설정해주세요.
          <br />
          나중에 프로필에서 변경할 수 있습니다.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={handleNicknameChange}
                placeholder={defaultNickname}
                maxLength={20}
                className="w-full px-4 py-3 border border-black-500 rounded-lg text-body-1 focus:outline-none focus:border-primary-200"
                autoFocus
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label-1 text-black-400">
                {nickname.length}/20
              </span>
            </div>
            <p className="text-label-4 text-gray-400">
              {DEFAULT_NICKNAME_NOTICE}
            </p>

            {error && <p className="text-label-4 text-red">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending || !nickname.trim() || !!error}
            className="w-full py-3 bg-primary-200 text-white rounded-lg text-body-1 font-semibold disabled:opacity-50"
          >
            {isPending ? "저장 중..." : "시작하기"}
          </button>
        </form>
      </div>
    </ModalContainer>
  );
};
