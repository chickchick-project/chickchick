import BoardTabBar, {
  IBoardTabBarProps,
} from "@/components/commons/tabBar/BoardTabBar";
import { SearchHeader } from "./search";
import SortDropdown, {
  ISortDropdownProps,
} from "@/components/commons/dropdown/SortDropdown";
import WriteButton from "./WriteButton";
import { Option, TSortBy } from "@/shared/constants/options";

interface IHeaderProps
  extends IBoardTabBarProps,
    Omit<Partial<ISortDropdownProps>, "type"> {
  currentSortBy: TSortBy | null;
  handleSortChange: (option: Option) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: () => void;
  searchKeyword: string;
}

export function Header({
  boards,
  selectedTab,
  handleTabClick,
  currentSortBy,
  handleSortChange,
  handleSearchSubmit,
  handleSearchChange,
  searchKeyword,
}: IHeaderProps) {
  const isBestPostTab = selectedTab === "BEST";
  return (
    <>
      <header className="w-full flex flex-col items-center gap-10 pt-10 pb-5 tablet:py-10 px-5 pc:px-0">
        <h1 className="text-headline-1 font-bold text-black-100 hidden tablet:block">
          커뮤니티
        </h1>
        <SearchHeader
          value={searchKeyword}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />
      </header>
      <nav className="flex flex-col items-center gap-5 w-full max-w-[1200px]">
        <div className="mobile:w-full mobile:px-5 tablet:w-[460px]">
          <BoardTabBar
            boards={boards}
            selectedTab={selectedTab}
            handleTabClick={handleTabClick}
          />
        </div>
        <div
          className={`flex w-full mobile:px-5 items-center ${
            !isBestPostTab
              ? "justify-end tablet:justify-between"
              : "justify-end"
          }`}
        >
          {!isBestPostTab && (
            <SortDropdown
              type="community"
              currentOption={currentSortBy}
              onSortChange={handleSortChange}
            />
          )}
          <WriteButton />
        </div>
      </nav>
    </>
  );
}
