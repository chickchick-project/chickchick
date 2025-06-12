import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";

export default function PostFormActions() {
  return (
    <div className="flex justify-center gap-2 w-full tablet:w-[432px]">
      <ButtonOutlinedPrimaryLFull type="button">
        임시 저장
      </ButtonOutlinedPrimaryLFull>
      <ButtonFilledPrimaryLFull type="submit">
        작성 완료
      </ButtonFilledPrimaryLFull>
    </div>
  );
}
