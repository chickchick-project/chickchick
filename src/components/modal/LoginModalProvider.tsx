"use client";

import { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useModalStore } from "@/client/stores/uiStore";
import { LoginModal } from "@/components/modal/LoginModal";
import { NicknameSetupModal } from "@/components/modal/NicknameSetupModal";
import { AccountLinkedModal } from "@/components/modal/AccountLinkedModal";
import { MODAL_KEYS } from "@/client/stores/uiStore";

interface PendingLink {
  token: string;
  provider: string;
}

export default function LoginModalProvider() {
  const { loginModal, closeModal, openModal } = useModalStore();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [nicknameModalClosed, setNicknameModalClosed] = useState(false);
  const [pendingLink, setPendingLink] = useState<PendingLink | null>(null);

  const isNewUser =
    status === "authenticated" && session?.user?.isNewUser === true;
  const defaultNickname = session?.user?.nickname ?? "";

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "link_confirm") {
      const token = params.get("token");
      const provider = params.get("provider");
      if (token && provider) {
        setPendingLink({ token, provider });
        // URL에서 파람 제거 (히스토리 오염 방지)
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (!isNewUser) setNicknameModalClosed(false);
  }, [isNewUser]);

  if (!mounted) return null;

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  if (pendingLink) {
    return createPortal(
      <AccountLinkedModal
        mode="confirm"
        provider={pendingLink.provider}
        token={pendingLink.token}
        closeModal={() => {
          setPendingLink(null);
          openModal(MODAL_KEYS.LOGIN);
        }}
      />,
      modalRoot,
    );
  }

  if (isNewUser && !nicknameModalClosed) {
    return createPortal(
      <NicknameSetupModal
        defaultNickname={defaultNickname}
        closeModal={() => setNicknameModalClosed(true)}
      />,
      modalRoot,
    );
  }

  if (!loginModal) return null;

  return createPortal(
    <Suspense fallback={null}>
      <LoginModal closeModal={() => closeModal(MODAL_KEYS.LOGIN)} />
    </Suspense>,
    modalRoot,
  );
}
