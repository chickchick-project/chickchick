import Image from "next/image";

interface PerfumeImageProps {
  src: string;
  alt: string;
}

// temp: 반응형 만들면 sizes 조정하기
export const PerfumeImage = ({ src, alt }: PerfumeImageProps) => {
  return (
    <div className="relative w-full aspect-square shadow-card rounded-xl">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`
            (max-width: 768px) 100vw, 
            (max-width: 1200px) 50vw, 
            33vw
          `}
        placeholder="blur"
        blurDataURL="/images/BlurShimmer.svg"
        priority
        className="object-contain"
      />
    </div>
  );
};
