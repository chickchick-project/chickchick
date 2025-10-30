import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/components/commons/author/author.constants";

interface UserProfileImageProps {
  imageUrl: string | null;
  nickname: string;
}

const UserProfileImage = ({ imageUrl, nickname }: UserProfileImageProps) => {
  const profileImageSrc = imageUrl || DEFAULT_PROFILE_IMAGE;

  return (
    <div className="relative w-[140px] h-[140px] overflow-hidden rounded-full">
      <Image
        src={profileImageSrc}
        alt={`${nickname}의 프로필`}
        fill
        sizes="140px"
        priority
        className="object-cover"
      />
    </div>
  );
};

export default UserProfileImage;
