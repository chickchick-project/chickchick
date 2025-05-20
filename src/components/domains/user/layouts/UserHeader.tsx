"use client";

import Image from "next/image";
import LevelChip from "@/components/commons/chip/LevelChip";
import { DEFAULT_PROFILE_IMAGE } from "@/components/commons/author/author.constants";
import { mockUserInfo } from "@/components/commons/navBar/navBar.constants";
import { users } from "@prisma/client";

const UserHeader = ({ user }: { user: users }) => {
  const profileImageSrc = user.image_url || DEFAULT_PROFILE_IMAGE;
  return (
    <header className="ml-10 mb-16 flex items-center gap-4">
      <div className="flex items-center gap-5">
        <Image src={profileImageSrc} width={140} height={140} alt="프로필" />
        <div className="flex flex-col my-[7px] gap-1">
          <LevelChip level={mockUserInfo.level} />
          <span className="text-headline-1 font-bold">{user?.nickname}</span>
          <div className="flex text-body-1 font-semibold text-black-100 gap-x-5">
            <span>글 123개</span>
            <span>리뷰 123개</span>
            <span>댓글 123개</span>
          </div>
          <div className="flex text-body-1 font-semibold text-black-300 gap-x-5">
            <span>팔로우 123</span>
            <span>팔로잉 123</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
