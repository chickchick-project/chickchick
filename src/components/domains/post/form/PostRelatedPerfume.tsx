import { ButtonFilledPrimaryLFit } from "@/components/commons/button/ButtonFilled";
import SubTitleLabel from "./element/SubTitleLabel";
import InputBase from "@/components/commons/input";
// import PerfumeCard from "@/components/commons/card/perfumeCard";
export default function PostRelatedPerfume() {
  return (
    <>
      <SubTitleLabel label="향수" htmlFor="perfume" />
      <section>
        <div className="flex gap-2 items-start">
          <InputBase
            id="perfume"
            name="perfume"
            isError={false}
            helperText="글 내용과 관련된 향수를 태그해 주세요"
            placeholder="향수명을 입력해주세요"
          />
          <ButtonFilledPrimaryLFit colorNum="200">
            + 추가하기
          </ButtonFilledPrimaryLFit>
        </div>
        {/* <div className="mt-5 bg-gray-300 p-5 rounded-xl grid grid-cols-4 gap-5 w-fit h-fit"><PerfumeCard/></div> */}
      </section>
    </>
  );
}
