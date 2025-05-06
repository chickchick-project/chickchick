import CommentSection from "./commentSection";
import PostContent from "./content";
import PostHeader from "./header";

export default function PageClient() {
  return (
    <article className="w-full max-w-[1000px]">
      <PostHeader />
      <PostContent />
      {/* <CommentSection /> */}
    </article>
  );
}
