import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";

interface IPostFormActionsProps {
  disabled: boolean;
  onSaveDraft?: () => void;
  saveStatus?: "idle" | "saving" | "saved";
}

export default function PostFormActions({
  disabled,
  onSaveDraft,
  saveStatus = "idle",
}: IPostFormActionsProps) {
  return (
    <div className="flex justify-center gap-2 w-full tablet:w-[432px]">
      <ButtonOutlinedPrimaryLFull
        type="button"
        onClick={onSaveDraft}
        disabled={saveStatus === "saving"}
      >
        임시 저장
      </ButtonOutlinedPrimaryLFull>
      <ButtonFilledPrimaryLFull type="submit" disabled={disabled}>
        작성 완료
      </ButtonFilledPrimaryLFull>
    </div>
  );
}
