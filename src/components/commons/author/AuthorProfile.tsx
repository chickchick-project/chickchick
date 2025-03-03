import React from "react";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/lib/constants/author";

interface AuthorProfileProps {
  name: string;
  profileImage?: string;
  size?: number;
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({
  name,
  profileImage = DEFAULT_PROFILE_IMAGE,
  size = 28,
}) => {
  return (
    <div className="flex items-center gap-2">
      {profileImage && (
        <Image
          src={profileImage}
          alt={`${name}의 프로필 이미지`}
          width={size}
          height={size}
          className="rounded-full"
        />
      )}
      <span className="text-label-2 font-medium">{name}</span>
    </div>
  );
};

export default AuthorProfile;
