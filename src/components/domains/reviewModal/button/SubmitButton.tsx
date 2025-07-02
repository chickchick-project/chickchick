import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";

export const SubmitButton = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="tablet:w-60 w-full">
        <ButtonFilledPrimaryLFull type="submit">완료</ButtonFilledPrimaryLFull>
      </div>
    </div>
  );
};
