import Image from "next/image";

interface IImageButton {
  image: {
    src: string;
    alt: string;
  };
  image_selected: {
    src: string;
    alt: string;
  };
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export const ImageButton = ({
  image,
  image_selected,
  children,
  isSelected,
  onClick,
}: IImageButton) => {
  return (
    <button
      className="flex flex-col gap-2 justify-center items-center"
      onClick={onClick}
      type="button"
    >
      {isSelected ? (
        <Image
          src={image_selected.src}
          alt={image_selected.alt}
          width={80}
          height={80}
        />
      ) : (
        <Image src={image.src} alt={image.alt} width={80} height={80} />
      )}
      <div
        className={`${
          isSelected ? "text-primary-300" : "text-gray-100"
        } text-[15px]`}
      >
        {children}
      </div>
    </button>
  );
};
