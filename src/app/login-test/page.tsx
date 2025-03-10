"use client";

import { LoginModal } from "@/components/modal/LoginModal";
import { useState } from "react";

export default function LoginTestPage() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };
  return (
    <>
      <button onClick={handleOpenModal}>login modal button</button>
      {openModal && <LoginModal />}
    </>
  );
}
