import { useState } from "react";

interface ModalState {
  isOpen: boolean;
  imageUrl: string;
  comment: string;
  perfumeName?: string;
}

export const useImageDetailModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    imageUrl: "",
    comment: "",
    perfumeName: "",
  });

  const openModal = (imageUrl: string, comment: string, perfumeName?: string) => {
    setModalState({ isOpen: true, imageUrl, comment, perfumeName });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, imageUrl: "", comment: "", perfumeName: "" });
  };

  const handleSave = (newComment: string) => {
    setModalState({ ...modalState, comment: newComment });
  };

  return {
    ...modalState,
    openModal,
    closeModal,
    handleSave,
  };
};
