import { DetailReviewSection } from "../domains/reviewModal/section/DetailReviewSection";
import { FeelingSection } from "../domains/reviewModal/section/FeelingSection";
import { GenderToneSection } from "../domains/reviewModal/section/GenderToneSection";
import { LastingSection } from "../domains/reviewModal/section/LastingSection";
import { PriceSection } from "../domains/reviewModal/section/PriceSection";
import { SeasonalSection } from "../domains/reviewModal/section/SeasonalSection";
import { SillageSection } from "../domains/reviewModal/section/SillageSection";
import { StatusSection } from "../domains/reviewModal/section/StatusSection";
import { Title } from "../domains/reviewModal/Title";
import { ModalContainer } from "./ModalContainer";

interface IReviewModalProps {
  closeModal: () => void;
}

export const ReviewModal = ({ closeModal }: IReviewModalProps) => {
  return (
    <ModalContainer closeModal={closeModal}>
      <div className="flex flex-col gap-10 w-[688px] h-[620px] rounded-2xl bg-white p-5">
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          <Title>이 향수에 대한 리뷰를 남겨주세요</Title>
          <div className="flex flex-col gap-10 p-5">
            <StatusSection />
            <FeelingSection />
            <LastingSection />
            <SillageSection />
            <GenderToneSection />
            <SeasonalSection />
            <PriceSection />
            <DetailReviewSection />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
