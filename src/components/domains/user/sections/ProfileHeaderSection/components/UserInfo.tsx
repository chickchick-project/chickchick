import LevelChip from "@/components/commons/chip/LevelChip";
import type { ApiMyProfileResponse } from "@/server/hono/schemas/me.schema";

interface UserInfoProps {
  user: ApiMyProfileResponse;
}

const UserInfo = ({ user }: UserInfoProps) => {
  // TODO: 추후 API 연동 시 실제 데이터로 교체
  const postCount = 123;
  const reviewCount = 123;
  const commentCount = 123;
  return (
    <div className="flex flex-col my-[7px] gap-1">
      <LevelChip level={user.level} />
      <span className="text-headline-1 font-bold">{user.nickname}</span>
      <div className="flex text-body-1 font-semibold text-black-100 gap-x-5">
        <span>글 {postCount}개</span>
        <span>리뷰 {reviewCount}개</span>
        <span>댓글 {commentCount}개</span>
      </div>
    </div>
  );
};

export default UserInfo;
