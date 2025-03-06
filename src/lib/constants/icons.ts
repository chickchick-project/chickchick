import {
  ArrowDownGray,
  ArrowDownPrimary,
  CheckGray,
  Close,
  BookmarkOutlined,
  Pen,
  Filter,
  Link,
  Pin,
  Globe,
  Home,
  Activity,
  Collection,
} from "../../../public/icons/icons";

type TIcon = {
  src: string;
  alt: string;
};

const ICONS: { [key: string]: TIcon } = {
  ArrowDownGray: { src: ArrowDownGray, alt: "arrow" },
  ArrowDownPrimary: { src: ArrowDownPrimary, alt: "arrow" },
  CheckGray: { src: CheckGray, alt: "check" },
  Close: { src: Close, alt: "close" },
  BookmarkOutlined: { src: BookmarkOutlined, alt: "bookmark" },
  Pen: { src: Pen, alt: "write" },
  Filter: { src: Filter, alt: "filter" },
  Link: { src: Link, alt: "link" },
  Pin: { src: Pin, alt: "pin" },
  Globe: { src: Globe, alt: "official site" },
  Home: { src: Home, alt: "home" },
  Activity: { src: Activity, alt: "activity" },
  Collection: { src: Collection, alt: "collection" },
};

export default ICONS;
