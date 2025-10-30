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
import { useUserStore } from "@/lib/stores/useUserStore";
import {
  CreateReviewInput,
  CreateReviewInputSchema,
} from "@/lib/hono/schemas/review.schema";
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

  const getInitialData = () => {
    return {
      usageStatus: "NOT_USED_YET" as PerfumeUsageStatus,
      content: "",
      feeling: undefined,
      longevity: undefined,
      sillage: undefined,
      genderTone: undefined,
      season: undefined,
      timeOfDay: undefined,
      pricePerception: undefined,
    };
  };

  const defaultValues = useMemo((): CreateReviewInput => {
    const initialData = getInitialData();

    return {
      content: initialData.content,
      usageStatus: initialData.usageStatus,
      attributes: {
        feeling: initialData.feeling,
        longevity: initialData.longevity,
        sillage: initialData.sillage,
        genderTone: initialData.genderTone,
        season: initialData.season || [],
        timeOfDay: initialData.timeOfDay,
        pricePerception: initialData.pricePerception,
      },
    };
  }, []);

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
          <Form
            schema={CreateReviewInputSchema}
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
