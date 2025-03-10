import ModalPortal from "@/lib/portal/ModalPortal";
import { useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
}

export const ModalContainer = ({ children }: ModalProps) => {
  const ref = useRef(null);

  return (
    <ModalPortal>
      <div className="flex justify-center items-center w-full h-full fixed top-0 left-0 z-50 bg-black-300 bg-opacity-90">
        <div ref={ref} className="flex flex-col justify-center items-center bg-white rounded-xl">
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};
