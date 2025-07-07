"use client";

import { useState, useEffect } from "react";
import { useModalStore } from "@/lib/stores/useModalStore";
import { LoginModal } from "@/components/modal/LoginModal";
import { MODAL_KEYS } from "@/lib/stores/useModalStore";
import { createPortal } from "react-dom";

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
    <LoginModal closeModal={() => closeModal(MODAL_KEYS.LOGIN)} />,
    modalRoot
  );
}
