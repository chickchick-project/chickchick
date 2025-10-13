import ICONS from "@/lib/constants/icons";
import Image from "next/image";
import {
  PERFUME_CARD_STYLES,
  PERFUME_CARD_TYPES,
} from "./perfumeCard.constants";
import { PerfumeCardProps } from "./perfumeCard.types";

export default function PerfumeCard({
  cardType = PERFUME_CARD_TYPES.DEFAULT,
  perfumeImage,
  brandName,
  perfumeName,
  onClick,
  onClose,
  className = "",
}: PerfumeCardProps) {
  return (
    <article
      className={`relative ${PERFUME_CARD_STYLES.images[cardType]} ${PERFUME_CARD_STYLES.cursor[cardType]} ${className}`}
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

      <figure className="relative aspect-square rounded-xl overflow-hidden shadow-card bg-white">
        <Image
          src={perfumeImage ?? "/images/BlurShimmer.svg"}
          alt={perfumeName || "Perfume Image"}
          fill
          sizes={`
            (max-width: 768px) 100vw, 
            (max-width: 1200px) 50vw, 
            33vw
          `}
          placeholder="blur"
          blurDataURL="/images/BlurShimmer.svg"
          className="object-contain"
        />
      </figure>

      <figcaption className="w-full text-left tablet:mt-2 mt-1 tablet:space-y-1 space-y-0.5">
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
      </figcaption>
    </article>
  );
}
