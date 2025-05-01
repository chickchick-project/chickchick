import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import { NAV_PATHS } from "@/components/commons/navBar/navBar.constants";
import ICONS from "@/lib/constants/icons";
import Image from "next/image";
import Link from "next/link";

export default function WriteButton() {
  return (
    <div className="hidden tablet:block">
      <Link href={NAV_PATHS.POST}>
        <ButtonOutlinedPrimaryLFit
          iconLeading={<Image src={ICONS.Pen.src} alt={ICONS.Pen.alt} width={20} height={20} />}
        >
          글쓰기
        </ButtonOutlinedPrimaryLFit>
      </Link>
    </div>
  );
}
