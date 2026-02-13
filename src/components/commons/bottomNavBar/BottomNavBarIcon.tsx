import Image from "next/image";
import Link from "next/link";

interface IBottomNavBarIcon {
  image: {
    src: { inactive: string; active: string };
    alt: string;
    href: string;
  };
  isActive: boolean;
}

export const BottomNavBarIcon = ({ image, isActive }: IBottomNavBarIcon) => {
  return (
    <Link
      className="flex flex-col gap-0.5 justify-center items-center w-[46px]"
      href={image.href}
    >
      <Image
        src={isActive ? image.src.active : image.src.inactive}
        alt={image.alt}
        width={24}
        height={24}
      />
      <div
        className={`text-label-5 font-bold ${
          isActive ? "text-black-100" : "text-gray-600"
        } text-center leading-normal`}
      >
        {image.alt}
      </div>
    </Link>
  );
};
