import CommentForm from "./comment/CommentForm";
import CommentIList from "./comment/CommentIList";
import { mockCommentList } from "./comment/mockCommentList";

export default function CommentSection() {
  const count = 10;
  return (
    <section className="px-4">
      <h2 className="text-title-2 tablet:text-headline-2 font-semibold text-black-100">
        댓글 {count}
      </h2>
      <CommentForm type="create" />
      <CommentIList commentList={mockCommentList} />
    </section>
  );
}
