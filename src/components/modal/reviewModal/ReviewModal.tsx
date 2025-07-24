import { ModalContainer } from "../ModalContainer";
import { Title } from "../../domains/reviewModal/Title";
import Form from "../../commons/form";
import { DetailReviewSection } from "../../domains/reviewModal/section/DetailReviewSection";
import { FeelingSection } from "../../domains/reviewModal/section/FeelingSection";
import { GenderToneSection } from "../../domains/reviewModal/section/GenderToneSection";
import { LastingSection } from "../../domains/reviewModal/section/LastingSection";
import { PriceSection } from "../../domains/reviewModal/section/PriceSection";
import { SeasonalSection } from "../../domains/reviewModal/section/SeasonalSection";
import { SillageSection } from "../../domains/reviewModal/section/SillageSection";
import { StatusSection } from "../../domains/reviewModal/section/StatusSection";
import { TimeSection } from "../../domains/reviewModal/section/TimeSection";
import { SubmitButton } from "@/components/domains/reviewModal/button/SubmitButton";
import { useInitialize } from "./form.initialize";
import { useUserStore } from "@/lib/stores/useUserStore";
import { CreateReviewSchema } from "@/lib/hono/schemas/review.schema";

interface IReviewModalProps {
  closeModal: () => void;
}

// TODO: tags 순서 확인하기 어떻게 순서대로 갈 것인지
//  1. 무작위로 선택되는대로 보여주기
//  2. 각 섹션 순서대로 보여주기 => tags 내부에 새로운 배열 필요할 듯
export const ReviewModal = ({ closeModal }: IReviewModalProps) => {
  const { user } = useUserStore();

  if (!user) alert("로그인 후 리뷰 작성이 가능합니다.");

  return (
    <ModalContainer
      className="tablet:w-[688px] tablet:h-[620px] w-full h-full absolute bottom-0 left-0"
      closeModal={closeModal}
    >
      <div className="flex flex-col gap-10 tablet:w-[688px] tablet:h-[620px] w-full h-full rounded-2xl bg-white p-5">
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          <Title>이 향수에 대한 리뷰를 남겨주세요</Title>
          <Form schema={CreateReviewSchema} useInitialize={useInitialize}>
            <div className="flex flex-col gap-10 p-5">
              <StatusSection />
              <FeelingSection />
              <LastingSection />
              <SillageSection />
              <GenderToneSection />
              <SeasonalSection />
              <TimeSection />
              <PriceSection />
              <DetailReviewSection />
              <SubmitButton />
            </div>
          </Form>
        </div>
      </div>
    </ModalContainer>
  );
};
