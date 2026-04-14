import { useEffect, useRef } from "react";
import Image from "next/image";
import ICONS from "@/shared/constants/icons";

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
  title?: string;
  className?: string;
  overlayClassName?: string;
}

export const ModalContainer = ({
  children,
  closeModal,
  title,
  className,
  overlayClassName,
}: ModalProps) => {
  const ref = useRef(null);

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      className={`flex justify-center ${
        overlayClassName || "items-center"
      } w-full h-full fixed top-0 left-0 z-50 bg-black-300 bg-opacity-90`}
      onClick={closeModal}
    >
      <div
        ref={ref}
        className={`flex flex-col relative bg-white rounded-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <>
            <div className="relative flex items-center justify-center px-6 pt-6 pb-4">
              <h2 className="text-heading-2 font-bold text-black-100">
                {title}
              </h2>
              <button onClick={closeModal} className="absolute right-5">
                <Image
                  src={ICONS.Close.src}
                  alt={ICONS.Close.alt}
                  width={24}
                  height={24}
                />
              </button>
            </div>
            <div className="w-full">{children}</div>
          </>
        ) : (
          <div className="w-full h-full relative">
            <button onClick={closeModal}>
              <Image
                className="absolute top-5 right-5"
                src={ICONS.Close.src}
                alt={ICONS.Close.alt}
                width={24}
                height={24}
              />
            </button>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
