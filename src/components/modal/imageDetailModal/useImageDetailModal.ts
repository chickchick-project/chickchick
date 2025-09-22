import { useState } from "react";

interface ModalState {
  isOpen: boolean;
  imageUrl: string;
  comment: string;
}

export const useImageDetailModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    imageUrl: "",
    comment: "",
  });

  const openModal = (imageUrl: string, comment: string) => {
    setModalState({ isOpen: true, imageUrl, comment });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, imageUrl: "", comment: "" });
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
