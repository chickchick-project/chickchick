import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import UserProfileImage from "./UserProfileImage";
import UserInfo from "./UserInfo";

const UserHeaderDisplay = ({ user }: { user: ApiMyProfileResponse }) => {
  return (
    <header className="ml-10 mb-16 flex items-center gap-4">
      <div className="flex items-center gap-5">
        <UserProfileImage imageUrl={user.imageUrl} nickname={user.nickname} />
        <UserInfo user={user} />
      </div>
    </header>
  );
};

export default UserHeaderDisplay;
