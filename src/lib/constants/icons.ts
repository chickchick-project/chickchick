import {
  ArrowDownGray,
  ArrowDownPrimary,
  CheckGray,
  Close,
  BookmarkOutlined,
  Pen,
  FilterGray,
  FilterPrimary,
  Link,
  Pin,
  Globe,
  Home,
  Activity,
  Collection,
  Search,
  Like,
  Comment,
  View,
  CloseCircle,
  ArrowRightGray,
  GlobePrimary,
  Reply,
  SwiperLeftButton,
  SwiperRightButton,
} from "../../../public/icons";

export type TIcon = {
  src: string;
  alt: string;
};

const ICONS: { [key: string]: TIcon } = {
  ArrowDownGray: { src: ArrowDownGray, alt: "arrow" },
  ArrowDownPrimary: { src: ArrowDownPrimary, alt: "arrow" },
  ArrowRightGray: { src: ArrowRightGray, alt: "arrow" },
  CheckGray: { src: CheckGray, alt: "check" },
  Close: { src: Close, alt: "close" },
  BookmarkOutlined: { src: BookmarkOutlined, alt: "bookmark" },
  Pen: { src: Pen, alt: "write" },
  FilterGray: { src: FilterGray, alt: "filterGray" },
  FilterPrimary: { src: FilterPrimary, alt: "filterPrimary" },
  Link: { src: Link, alt: "link" },
  Pin: { src: Pin, alt: "pin" },
  Globe: { src: Globe, alt: "official site" },
  GlobePrimary: { src: GlobePrimary, alt: "official site" },
  Home: { src: Home, alt: "home" },
  Activity: { src: Activity, alt: "activity" },
  Collection: { src: Collection, alt: "collection" },
  Search: { src: Search, alt: "search" },
  Like: { src: Like, alt: "like" },
  Comment: { src: Comment, alt: "comment" },
  View: { src: View, alt: "view" },
  CloseCircle: { src: CloseCircle, alt: "close" },
  Reply: { src: Reply, alt: "reply" },
  SwiperLeftButton: { src: SwiperLeftButton, alt: "swiper left" },
  SwiperRightButton: { src: SwiperRightButton, alt: "swiper right" },
};

export default ICONS;
