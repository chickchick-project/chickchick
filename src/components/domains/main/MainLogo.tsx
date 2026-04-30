import IMAGES from "@/shared/constants/images";
import Image from "next/image";

export const MainLogo = () => {
  return (
    <section className="tablet:flex hidden w-full justify-center items-center py-10">
      <Image
        src={IMAGES.Logo.src}
        alt={IMAGES.Logo.alt}
        width={232}
        height={86}
        sizes="232px"
        priority
        fetchPriority="high"
      />
    </section>
  );
};
