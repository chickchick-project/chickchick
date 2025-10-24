"use client";

import React, { useState } from "react";
import Image from "next/image";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { PostCard } from "@/components/commons/card/postCard";
import ICONS from "@/lib/constants/icons";
import { useRecentPostsStore } from "@/lib/stores/useRecentPostsStore";
import { useRecentPerfumesStore } from "@/lib/stores/useRecentPerfumesStore";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const ScrollRowSection = ({
  title,
  children,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  title: string;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-y-5">
      <span className="text-headline-2 font-semibold ml-4 tablet:ml-[50px]">
        {title}
      </span>
      <div className="w-full flex justify-center">
        <div className="relative w-fit">
          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full ml-[-20px] z-10 p-2 rounded-full hover:bg-gray-100"
              aria-label="이전 게시글 보기"
            >
              <Image
                src={ICONS.ArrowDownGray.src}
                width={36}
                height={36}
                alt="left"
                className="rotate-90"
              />
            </button>
          )}

          {children}

          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full mr-[-20px] z-10 p-2 rounded-full hover:bg-gray-100"
              aria-label="다음 게시글 보기"
            >
              <Image
                src={ICONS.ArrowDownGray.src}
                width={36}
                height={36}
                alt="right"
                className="rotate-[270deg]"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const UserFooter = () => {
  const isTabletOrLarger = useMediaQuery("(min-width: 768px)");

  const recentPostItems = useRecentPostsStore((s) => s.items);
  const postsHydrated = useRecentPostsStore((s) => s._hasHydrated);

  const recentPerfumeItems = useRecentPerfumesStore((s) => s.items);
  const perfumesHydrated = useRecentPerfumesStore((s) => s._hasHydrated);

  const [postIndex, setPostIndex] = useState(0);
  const [perfumeIndex, setPerfumeIndex] = useState(0);

  const POSTS_PER_VIEW = 2;
  const PERFUMES_PER_VIEW = 5;

  if (!postsHydrated || !perfumesHydrated || isTabletOrLarger === undefined) {
    return null;
  }

  const visiblePosts = isTabletOrLarger
    ? recentPostItems.slice(postIndex, postIndex + POSTS_PER_VIEW)
    : recentPostItems;
  const hasPrevPost = isTabletOrLarger && postIndex > 0;
  const hasNextPost =
    isTabletOrLarger && postIndex + POSTS_PER_VIEW < recentPostItems.length;

  const visiblePerfumes = isTabletOrLarger
    ? recentPerfumeItems.slice(perfumeIndex, perfumeIndex + PERFUMES_PER_VIEW)
    : recentPerfumeItems;
  const hasPrevPerfume = isTabletOrLarger && perfumeIndex > 0;
  const hasNextPerfume =
    isTabletOrLarger &&
    perfumeIndex + PERFUMES_PER_VIEW < recentPerfumeItems.length;

  const handlePrevPost = () => {
    setPostIndex((prev) => Math.max(0, prev - POSTS_PER_VIEW));
  };
  const handleNextPost = () => {
    setPostIndex((prev) =>
      Math.min(prev + POSTS_PER_VIEW, recentPostItems.length - POSTS_PER_VIEW)
    );
  };
  const handlePrevPerfume = () => {
    setPerfumeIndex((prev) => Math.max(0, prev - PERFUMES_PER_VIEW));
  };
  const handleNextPerfume = () => {
    setPerfumeIndex((prev) =>
      Math.min(
        prev + PERFUMES_PER_VIEW,
        recentPerfumeItems.length - PERFUMES_PER_VIEW
      )
    );
  };

  return (
    <div className="flex flex-col gap-y-16 py-[60px]">
      <ScrollRowSection
        title="최근에 본 게시글"
        hasPrev={hasPrevPost}
        hasNext={hasNextPost}
        onPrev={handlePrevPost}
        onNext={handleNextPost}
      >
        <div className="flex flex-col gap-4 tablet:grid pc:grid-cols-2 tablet:grid-cols-1 tablet:gap-x-4">
          {recentPostItems.length === 0 ? (
            <span className="text-gray-500 text-center tablet:col-span-2">
              최근에 본 게시글이 없습니다.
            </span>
          ) : (
            visiblePosts.map((ri) => {
              const postForCard = {
                ...ri.item,
                userId: ri.item.author.id,
              };
              return (
                <PostCard
                  key={ri.id}
                  {...postForCard}
                  updatedAt={ri.item.updatedAt ?? ri.item.createdAt}
                  isAuthor={false}
                  cardType={"small"}
                />
              );
            })
          )}
        </div>
      </ScrollRowSection>
      <ScrollRowSection
        title="최근에 본 향수"
        hasPrev={hasPrevPerfume}
        hasNext={hasNextPerfume}
        onPrev={handlePrevPerfume}
        onNext={handleNextPerfume}
      >
        <div className="grid grid-cols-2 gap-4 px-4 tablet:flex tablet:flex-row tablet:gap-x-[50px] tablet:px-0">
          {recentPerfumeItems.length === 0 ? (
            <span className="text-gray-500">최근에 본 향수가 없습니다.</span>
          ) : (
            visiblePerfumes.map((ri) => (
              <PerfumeCard
                key={ri.id}
                className="w-full tablet:w-[180px]"
                cardType="default"
                perfumeImage={ri.item.imageUrl}
                brandName={ri.item.brandName}
                perfumeName={ri.item.perfumeName}
              />
            ))
          )}
        </div>
      </ScrollRowSection>
    </div>
  );
};

export default UserFooter;
