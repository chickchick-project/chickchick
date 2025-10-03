"use client";

import { useFormContext } from "react-hook-form";
import { SubTitle } from "../SubTitle";

export const DetailReviewSection = () => {
  const { register, watch } = useFormContext();
  const MAX_LENGTH = 500;
  const content = watch("content") || "";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <SubTitle>자세한 후기를 알려주세요.</SubTitle>
        <div className="text-black-300 text-sm">
          향수를 사용하면서 느낀 경험을 더 자세히 이야기해 주세요!
        </div>
      </div>
      <div>
        <textarea
          className="w-full rounded-xl border border-gray-200 bg-white p-5 text-[15px] resize-none focus:outline-none"
          placeholder="후기를 적어주세요 (선택 사항)"
          rows={5}
          maxLength={MAX_LENGTH}
          {...register("content")}
        />
        <div className="flex justify-end">
          <span className="text-sm text-gray-100">
            {content.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
};
