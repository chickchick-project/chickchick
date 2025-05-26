"use client";

import { useModalStore } from "@/lib/stores/useModalStore";
import { MODAL_KEYS } from "@/lib/stores/useModalStore";
import { LoginModal } from "@/components/modal/LoginModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loginModal, closeModal } = useModalStore();

  return (
    <>
      {children}
      {loginModal && (
        <LoginModal closeModal={() => closeModal(MODAL_KEYS.LOGIN)} />
      )}
    </>
  );
}
