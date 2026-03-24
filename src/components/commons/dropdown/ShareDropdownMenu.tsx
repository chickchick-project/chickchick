import kakaoShare from "@/client/utils/share/kakaoShare";
import handleShare from "@/client/utils/share/linkShare";
import { Option } from "@/shared/constants/options";
import DropdownMenu from "./DropdownMenu";
export default function ShareDropdownMenu({
  closeMenu,
  ref,
}: {
  closeMenu: () => void;
  ref: React.RefObject<HTMLDivElement>;
}) {
  const shareOptions: Option[] = [
    { label: "카카오톡 공유", value: "kakao" },
    { label: "링크 복사", value: "link" },
  ];

  const handleSelectOption = async (option: Option) => {
    if (option.value === "kakao") {
      await kakaoShare();
    } else if (option.value === "link") {
      handleShare();
    }
    closeMenu();
  };
  return (
    <div ref={ref} className="absolute right-0 top-full mt-1 w-32 z-50">
      <DropdownMenu
        options={shareOptions}
        handleSelectOption={handleSelectOption}
      />
    </div>
  );
}
