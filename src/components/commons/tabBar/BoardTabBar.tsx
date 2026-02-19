export interface IBoardTabBarProps {
  boards: { key: string; label: string }[];
  selectedTab: string;
  handleTabClick: (key: string) => void;
}

export default function BoardTabBar({
  boards,
  selectedTab,
  handleTabClick,
}: IBoardTabBarProps) {
  return (
    <div className="flex justify-between items-center w-full" role="tablist">
      {boards.map((board) => (
        <button
          onClick={() => handleTabClick(board.key)}
          key={board.key}
          className="flex flex-col justify-start items-center gap-2"
          role="tab"
          aria-selected={selectedTab === board.key}
          aria-label={board.label}
          tabIndex={selectedTab === board.key ? 0 : -1}
        >
          <div
            className={`w-6 h-[3px] rounded-full ${
              selectedTab === board.key ? "bg-primary-200" : "bg-gray-200"
            }`}
            aria-hidden="true"
          />
          <div
            className={`justify-center ${
              selectedTab === board.key ? "font-semibold" : "font-normal"
            } text-black-100 tablet:text-lg text-sm whitespace-nowrap`}
          >
            {board.label}
          </div>
        </button>
      ))}
    </div>
  );
}
