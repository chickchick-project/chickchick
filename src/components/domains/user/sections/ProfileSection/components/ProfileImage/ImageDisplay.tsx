import Image from "next/image";
import ICONS from "@/shared/constants/icons";
import { DEFAULT_PROFILE_IMAGE } from "@/components/commons/author/author.constants";

interface ImageDisplayProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  onEditClick: () => void;
}

export const ImageDisplay = ({
  imageUrl,
  previewUrl,
  onEditClick,
}: ImageDisplayProps) => {
  const displaySrc = previewUrl || imageUrl || DEFAULT_PROFILE_IMAGE;

  return (
    <div className="relative w-40 h-40">
      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <Image
          src={displaySrc}
          alt="프로필 이미지"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={!previewUrl}
          className="object-cover rounded-full"
        />
      </div>

      {/* 수정 버튼 */}
      <button
        type="button"
        onClick={onEditClick}
        className="absolute bottom-1 right-1 flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-primary-100 shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors"
        aria-label="프로필 사진 변경"
      >
        <Image
          src={ICONS.Insta.src}
          alt="프로필 사진 변경"
          className="[filter:brightness(0)_saturate(100%)_invert(28%)_sepia(14%)_saturate(1140%)_hue-rotate(328deg)_brightness(95%)_contrast(89%)]"
        />
      </button>
    </div>
  );
};
