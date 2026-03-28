"use client";

import { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "@/client/stores/uiStore";
import { LoginModal } from "@/components/modal/LoginModal";
import { MODAL_KEYS } from "@/client/stores/uiStore";

export default function LoginModalProvider() {
  const { loginModal, closeModal } = useModalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !loginModal) return null;

  const modalRoot = document.getElementById("modal");
  if (!modalRoot) return null;

  return createPortal(
    <Suspense fallback={null}>
      <LoginModal closeModal={() => closeModal(MODAL_KEYS.LOGIN)} />
    </Suspense>,
    modalRoot,
  );
}
