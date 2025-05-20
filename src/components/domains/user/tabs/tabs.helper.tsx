import { TabItemConfig } from "./tabs.type";

const TAB_CONFIGS: TabItemConfig[] = [
  {
    getLabel: (isMe, nickname) =>
      !isMe && nickname ? (
        <>
          {nickname}님의
          <br />
          컬렉션
        </>
      ) : (
        "나의 컬렉션"
      ),
    value: "collection",
  },
  {
    getLabel: (isMe, nickname) =>
      !isMe && nickname ? (
        <>
          {nickname}님의
          <br />
          취향
        </>
      ) : (
        "북마크"
      ),
    value: "bookmarks",
  },
  {
    getLabel: () => "내 활동",
    value: "activity",
    isMeOnly: true,
  },
  {
    getLabel: () => "내 정보",
    value: "profile",
    isMeOnly: true,
  },
];

const getRenderableTabItems = (isMe?: boolean, nickname?: string) => {
  return TAB_CONFIGS.filter((config) => {
    if (!isMe) {
      return ["collection", "bookmarks"].includes(config.value);
    }
    return true;
  }).map((config) => ({
    label: config.getLabel(isMe, nickname),
    value: config.value,
  }));
};

export { getRenderableTabItems };
