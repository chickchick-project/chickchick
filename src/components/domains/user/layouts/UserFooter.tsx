import React from "react";
import Image from "next/image";
// import PerfumeCard from "@/components/commons/card/perfumeCard";
import { PostCard } from "@/components/commons/card/postCard";
import ICONS from "@/lib/constants/icons";
// import { mockPerfumeCardData } from "@/lib/mocks/perfumeCard";
import { mockCommunityPostData } from "@/lib/mocks/communityCard";

const ScrollRowSection = ({
  title,
  children,
  gap = "gap-x-2",
}: {
  title: string;
  children: React.ReactNode;
  gap?: string;
}) => (
  <div className="flex flex-col gap-y-5">
    <span className="text-headline-2 font-semibold ml-[50px]">{title}</span>
    <div className="relative w-[1200px]">
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <Image
          src={ICONS.ArrowDownGray.src}
          width={16}
          height={16}
          alt="left"
          className="rotate-90"
        />
      </div>
      <div className={`flex justify-center ${gap}`}>{children}</div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <Image
          src={ICONS.ArrowDownGray.src}
          width={16}
          height={16}
          alt="right"
          className="rotate-[270deg]"
        />
      </div>
    </div>
  </div>
);

const UserFooter = () => {
  return (
    <div className="flex flex-col gap-y-16 mt-[60px]">
      <ScrollRowSection title="최근에 본 게시글 10">
        {Array.from({ length: 2 }).map((_, idx) => {
          const mockData = mockCommunityPostData[idx];
          return (
            <PostCard
              key={idx}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...(mockData as any)}
              author={{
                id: "mock-id",
                nickname: mockData.author,
                imageUrl: "",
              }}
              createdAt={new Date(mockData.createdAt)}
              updatedAt={new Date(mockData.createdAt)}
              category={mockData.categoryType}
              userId="mock-user-id"
              published={true}
              viewCount={0}
              likeCount={0}
              commentCount={0}
              isAuthor={false}
            />
          );
        })}
      </ScrollRowSection>
      <ScrollRowSection title="최근에 본 향수 10" gap="gap-x-[50px]">
        {Array.from({ length: 5 }).map((_, idx) => (
          <React.Fragment key={idx}>{idx}</React.Fragment>
        ))}
      </ScrollRowSection>
    </div>
  );
};

export default UserFooter;
