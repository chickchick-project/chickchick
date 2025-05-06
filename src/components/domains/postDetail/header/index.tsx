import AuthorInfo from "@/components/commons/author/AuthorInfo";
import { InfoType } from "@/components/commons/author/author.types";
import BoardChip from "@/components/commons/chip/BoardChip";
import PostInteractions from "./PostInteractions";
import PostActions from "./PostActions";

type TAuthorInfo = {
  author: string;
  createdAt: string;
  profileImage: string;
  isAuthor: boolean;
  info: InfoType;
};
const authorInfo: TAuthorInfo = {
  author: "김철수",
  createdAt: "2023-10-01",
  profileImage: "",
  isAuthor: false,
  info: {
    type: "post",
    item: [
      { type: "Comment", count: 999 },
      { type: "View", count: 999 },
    ],
  },
};

export default function PostHeader() {
  return (
    <header className="mobile:mt-10 tablet:mt-[60px]">
      <div className="flex item-center justify-between">
        <BoardChip type="question" />
        <PostInteractions />
      </div>
      <h1 className="mt-5 mb-4 tablet:mb-5 text-title-1 tablet:text-headline-3 font-semibold text-black-100">
        국무총리·국무위원 또는 정부위원은 국회나 그 위원회에 출석하여
        국정처리상황을 보고하거나 의견을 진술하고 질문에 응답할 수 있다.
      </h1>
      <div className="flex items-center justify-between">
        <AuthorInfo
          author={authorInfo.author}
          createdAt={authorInfo.createdAt}
          profileImage={authorInfo.profileImage}
          isAuthor={false}
          info={authorInfo.info}
        />
        <PostActions />
      </div>
      <div className="divider-horizontal mt-4 tablet:mt-5 mb-10" />
    </header>
  );
}
