import ICONS from "@/lib/constants/icons";
import Image from "next/image";

export const PERFUME_CARD_TYPES = {
  DEFAULT: "default",
  CLOSABLE: "closable",
} as const;

type PerfumeCardType =
  (typeof PERFUME_CARD_TYPES)[keyof typeof PERFUME_CARD_TYPES];

const PERFUME_CARD_STYLES = {
  images: {
    [PERFUME_CARD_TYPES.DEFAULT]: "w-[180px]",
    [PERFUME_CARD_TYPES.CLOSABLE]: "w-[144px]",
  },
  brandName: {
    [PERFUME_CARD_TYPES.DEFAULT]: "text-label-1",
    [PERFUME_CARD_TYPES.CLOSABLE]: "text-label-2",
  },
  perfumeName: {
    [PERFUME_CARD_TYPES.DEFAULT]: "text-body-1",
    [PERFUME_CARD_TYPES.CLOSABLE]: "text-body-2",
  },
  cursor: {
    [PERFUME_CARD_TYPES.DEFAULT]: "cursor-pointer",
    [PERFUME_CARD_TYPES.CLOSABLE]: "cursor-default",
  },
} as const;

export interface PerfumeCardProps {
  cardType?: PerfumeCardType;
  perfumeImage: string;
  brandName: string;
  perfumeName: string;
  onClick?: () => void;
  onClose?: () => void;
}

export const PerfumeCard = ({
  cardType = PERFUME_CARD_TYPES.DEFAULT,
  perfumeImage,
  brandName,
  perfumeName,
  onClick,
  onClose,
}: PerfumeCardProps) => {
  return (
    <article
      className={`relative ${PERFUME_CARD_STYLES.images[cardType]} ${PERFUME_CARD_STYLES.cursor[cardType]}`}
      onClick={onClick}
    >
      {cardType === PERFUME_CARD_TYPES.CLOSABLE && (
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-2 right-2 z-10"
        >
          <Image {...ICONS.CloseCircle} width={20} height={20} />
        </button>
      )}

      <figure className="relative aspect-square rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full h-full">
        {perfumeImage ? (
          <Image
            src={perfumeImage}
            alt="향수 이미지"
            fill
            sizes={`
            (max-width: 768px) 100vw, 
            (max-width: 1200px) 50vw, 
            33vw
          `}
          />
        ) : (
          <div className="w-full h-full bg-slate-400" />
        )}
      </figure>

      <footer className="pt-2">
        <p
          className={`text-black-300 font-medium ${PERFUME_CARD_STYLES.brandName[cardType]} overflow-hidden whitespace-nowrap text-ellipsis`}
        >
          {brandName}
        </p>
        <h3
          className={`text-black-100 font-semibold ${PERFUME_CARD_STYLES.perfumeName[cardType]} overflow-hidden whitespace-nowrap text-ellipsis`}
        >
          {perfumeName}
        </h3>
      </footer>
    </article>
  );
};
