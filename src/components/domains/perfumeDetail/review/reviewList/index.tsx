import { useMemo } from "react";
import { ButtonFilledGrayLFull } from "@/components/commons/button/ButtonFilled";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { ReviewItem } from "./reviewItem";
import { ReviewListProps } from "../review.type";
import { getCategoryById, getTagByKey } from "@/lib/utils/review.helpers";

export const ReviewList = ({ data }: ReviewListProps) => {
  const reviewItems = useMemo(() => {
    return data.map((review) => {
      const tags = review.attributeSelections.map((selection) => {
        const category = getCategoryById(selection.option.attributeId);
        const key = selection.option.value;
        return category ? getTagByKey(category, key) : key;
      });

      return {
        id: review.id,
        content: review.content,
        tags,
        author: review.author.nickname,
        createdAt: review.createdAt.toString(),
        profileImage: review.author.imageUrl || "",
        isMain: false,
        usageStatus: review.usageStatus,
      };
    });
  }, [data]);
  return (
    <section className="flex flex-col gap-5">
      <SectionTitle itemCount={data.length}>리뷰</SectionTitle>
      <ul className="flex flex-col tablet:gap-6 tablet:px-5 pc:px-0">
        {reviewItems.map((item) => (
          <li
            key={item.id}
            className="last:border-0 border-b border-gray-200 tablet:border-0"
          >
            <ReviewItem {...item} />
          </li>
        ))}
      </ul>
      {data.length > 3 && (
        <div className="px-5 pc:px-0">
          <ButtonFilledGrayLFull>더보기</ButtonFilledGrayLFull>
        </div>
      )}
    </section>
  );
};
