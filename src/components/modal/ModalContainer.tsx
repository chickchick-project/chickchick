import ICONS from "@/lib/constants/icons";
import ModalPortal from "@/lib/portal/ModalPortal";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
  className?: string;
  overlayClassName?: string;
}

export const ModalContainer = ({
  children,
  closeModal,
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
    <ModalPortal>
      <div
        className={`flex justify-center ${
          overlayClassName || "items-center"
        } w-full h-full fixed top-0 left-0 z-50 bg-black-300 bg-opacity-90`}
      >
        <div
          ref={ref}
          className={`flex flex-col justify-center items-center relative bg-white rounded-xl ${className}`}
        >
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
        </div>
      </div>
    </ModalPortal>
  );
};
