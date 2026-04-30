import ReactDOM from "react-dom";

interface IModalPortalProps {
  children: React.ReactNode;
}

export const ModalPortal = ({ children }: IModalPortalProps) => {
  const el = document.getElementById("modal");
  return ReactDOM.createPortal(children, el as HTMLElement);
};
export default ModalPortal;
