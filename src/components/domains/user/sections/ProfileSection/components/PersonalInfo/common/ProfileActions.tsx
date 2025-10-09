import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";

interface ProfileActionsProps {
  onWithdraw: () => void;
  isSubmitting: boolean;
}

export const ProfileActions = ({
  onWithdraw,
  isSubmitting,
}: ProfileActionsProps) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-20">
      <div className="flex gap-2 w-[368px]">
        <ButtonOutlinedPrimaryLFull type="button" onClick={onWithdraw}>
          탈퇴
        </ButtonOutlinedPrimaryLFull>
        <ButtonFilledPrimaryLFull type="submit" disabled={isSubmitting}>
          {isSubmitting ? "수정 중..." : "수정"}
        </ButtonFilledPrimaryLFull>
      </div>
    </div>
  );
};
