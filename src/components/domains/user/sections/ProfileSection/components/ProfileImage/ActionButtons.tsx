import { ButtonFilledPrimaryLFit } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";

interface ActionButtonsProps {
  isUploading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const ActionButtons = ({
  isUploading,
  onSave,
  onCancel,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-2 mt-2">
      <ButtonFilledPrimaryLFit onClick={onSave} disabled={isUploading}>
        {isUploading ? "저장 중..." : "이미지 저장"}
      </ButtonFilledPrimaryLFit>
      <ButtonOutlinedPrimaryLFit onClick={onCancel} disabled={isUploading}>
        취소
      </ButtonOutlinedPrimaryLFit>
    </div>
  );
};
