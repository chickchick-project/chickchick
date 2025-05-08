import Image from "next/image";
import ICONS from "@/lib/constants/icons";

export default function ReplyIcon() {
  return (
    <>
      <Image
        src={ICONS.Reply.src}
        alt={ICONS.Reply.alt}
        width={16}
        height={13}
        className="w-3 h-[9.75px] tablet:w-4 tablet:h-[13px]"
      />
    </>
  );
}
