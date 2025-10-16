import Image from "next/image";
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
  const displaySrc = previewUrl || imageUrl;

  return (
    <div className="relative w-40 h-40">
      {/* 프로필 이미지 */}
      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {displaySrc && (
          <Image
            src={displaySrc}
            alt="프로필 이미지"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={!previewUrl}
            className="object-cover rounded-full"
          />
        )}
      </div>

      {/* 수정 버튼 */}
      <button
        type="button"
        onClick={onEditClick}
        className="absolute bottom-1 right-1 flex items-center justify-center w-10 h-10 bg-slate-700 rounded-full border-2 border-white shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        aria-label="프로필 사진 변경"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
