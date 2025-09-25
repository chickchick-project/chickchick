import React from "react";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "./author.constants";
import { AuthorProfileProps } from "./author.types";

export default function AuthorProfile({
  name,
  profileImage,
  size = 28,
}: AuthorProfileProps) {
  const profileImageSrc =
    profileImage && profileImage.trim() !== ""
      ? profileImage
      : DEFAULT_PROFILE_IMAGE;
  return (
    <div className="flex items-center gap-2">
      <Image
        src={profileImageSrc}
        alt={`${name}의 프로필 이미지`}
        width={size}
        height={size}
        className="rounded-full"
      />

      <span className="text-label-2 font-medium">{name}</span>
    </div>
  );
}
