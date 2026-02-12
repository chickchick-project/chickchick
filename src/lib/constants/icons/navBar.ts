import Home from "../../../../public/icons/bottomNavBar/Home.svg";
import HomeActive from "../../../../public/icons/bottomNavBar/HomeActive.svg";
import Search from "../../../../public/icons/bottomNavBar/Search.svg";
import SearchActive from "../../../../public/icons/bottomNavBar/SearchActive.svg";
import Writing from "../../../../public/icons/bottomNavBar/Writing.svg";
import WritingActive from "../../../../public/icons/bottomNavBar/WritingActive.svg";
import Mypage from "../../../../public/icons/bottomNavBar/Mypage.svg";
import MypageActive from "../../../../public/icons/bottomNavBar/MypageActive.svg";

export const NAV_BAR_ICONS = {
  home: { inactive: Home, active: HomeActive, alt: "홈" },
  search: { inactive: Search, active: SearchActive, alt: "검색" },
  writing: { inactive: Writing, active: WritingActive, alt: "글쓰기" },
  mypage: { inactive: Mypage, active: MypageActive, alt: "마이페이지" },
} as const;
