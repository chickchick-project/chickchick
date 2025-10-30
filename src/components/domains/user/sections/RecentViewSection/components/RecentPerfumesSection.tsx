import PerfumeCard from "@/components/commons/card/perfumeCard";
import { ScrollRowSection } from "@/components/domains/user/components/ScrollRowSection";
import { useRecentPerfumes } from "../hooks/useRecentPerfumes";

interface RecentPerfumesSectionProps {
  isTabletOrLarger: boolean | undefined;
}

export const RecentPerfumesSection = ({
  isTabletOrLarger,
}: RecentPerfumesSectionProps) => {
  const recentPerfumes = useRecentPerfumes(isTabletOrLarger);

  if (!recentPerfumes.isHydrated) {
    return null;
  }

  return (
    <ScrollRowSection
      title="최근에 본 향수"
      hasPrev={recentPerfumes.pagination.hasPrev}
      hasNext={recentPerfumes.pagination.hasNext}
      onPrev={recentPerfumes.pagination.handlePrev}
      onNext={recentPerfumes.pagination.handleNext}
    >
      <div className="grid grid-cols-2 gap-4 px-4 tablet:flex tablet:flex-row tablet:gap-x-[50px] tablet:px-0">
        {recentPerfumes.isEmpty ? (
          <span className="text-gray-500">최근에 본 향수가 없습니다.</span>
        ) : (
          recentPerfumes.perfumes.map((perfume) => (
            <PerfumeCard
              key={perfume.id}
              className="w-full tablet:w-[180px]"
              cardType="default"
              perfumeImage={perfume.imageUrl}
              brandName={perfume.brandName}
              perfumeName={perfume.perfumeName}
            />
          ))
        )}
      </div>
    </ScrollRowSection>
  );
};
