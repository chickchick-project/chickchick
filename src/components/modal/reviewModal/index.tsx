import { useMemo } from "react";
import { ModalContainer } from "../ModalContainer";
import { Title } from "./components/Title";
import Form from "../../commons/form";
import {
  StatusSection,
  FeelingSection,
  LongevitySection,
  SillageSection,
  GenderToneSection,
  SeasonalSection,
  TimeSection,
  PriceSection,
  DetailReviewSection,
} from "./components/sections";
import { useReviewSubmit } from "./useReviewSubmit";
import { useUserStore } from "@/client/stores/useUserStore";
import { CreateReviewClientSchema, type CreateReviewClientInput } from "./reviewSchema.client";
import { SubmitButton } from "./components/button/SubmitButton";
import { PerfumeUsageStatus } from "@prisma/client";

interface IReviewModalProps {
  closeModal: () => void;
}

// TODO: tags 순서 확인하기 어떻게 순서대로 갈 것인지
//  1. 무작위로 선택되는대로 보여주기
//  2. 각 섹션 순서대로 보여주기 => tags 내부에 새로운 배열 필요할 듯
export const ReviewModal = ({ closeModal }: IReviewModalProps) => {
  const { user } = useUserStore();

  // 리뷰 제출 로직
  const { onSubmit } = useReviewSubmit(closeModal);

  const defaultValues = useMemo((): CreateReviewClientInput => {
    return {
      content: "",
      usageStatus: "NOT_USED_YET" as PerfumeUsageStatus,
      attributes: {
        feeling: "",
        longevity: "",
        sillage: "",
        genderTone: "",
        season: [],
        timeOfDay: "",
        pricePerception: "",
      },
    };
  }, []);

  if (!user) {
    alert("로그인 후 리뷰 작성이 가능합니다.");
    closeModal();
    return;
  }
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
          <Form
            schema={CreateReviewClientSchema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          >
            <div className="flex flex-col gap-10 p-5">
              <StatusSection />
              <FeelingSection />
              <LongevitySection />
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
