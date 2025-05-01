import BoardTabBar, { IBoardTabBarProps } from "@/components/commons/tabBar/BoardTabBar";
import { SearchHeader } from "./search";
import SortDropdown, { ISortDropdownProps } from "@/components/commons/dropdown/SortDropdown";
import WriteButton from "./WriteButton";

interface IHeaderProps extends IBoardTabBarProps, Omit<Partial<ISortDropdownProps>, "type"> {}

export function Header({ boards, selectedTab, handleTabClick }: IHeaderProps) {
  return (
    <>
      <header className="w-full flex flex-col items-center gap-10 pt-10 pb-5 tablet:py-10">
        <h1 className="text-headline-1 font-bold text-black-100 hidden tablet:block">커뮤니티</h1>
        <SearchHeader />
      </header>
      <nav className="flex flex-col gap-5 w-full max-w-[1200px]">
        <BoardTabBar boards={boards} selectedTab={selectedTab} handleTabClick={handleTabClick} />
        <div className={`flex items-center ${selectedTab !== "best" ? "justify-between" : "justify-end"}`}>
          {selectedTab !== "best" && <SortDropdown type="community" />}
          <WriteButton />
        </div>
      </nav>
    </>
  );
}
