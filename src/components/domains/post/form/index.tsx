import PostCategory from "./PostCategory";
import PostEditor from "./PostEditor";
import PostFormActions from "./PostFormActions";
import PostRelatedPerfume from "./PostRelatedPerfume";
import PostTitle from "./PostTitle";

export default function PostForm() {
  return (
    <form className="w-full flex flex-col items-center gap-14">
      <div className="w-full grid grid-cols-1 tablet:grid-cols-[85px_1fr] tablet:gap-x-[200px] gap-y-2 tablet:gap-y-14">
        <PostCategory />
        <PostTitle />
        <PostEditor />
        <PostRelatedPerfume />
      </div>
      <PostFormActions />
    </form>
  );
}
