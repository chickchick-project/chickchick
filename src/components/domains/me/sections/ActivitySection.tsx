import { SubTabSwitcher } from "../tabs/SubTabs";

type ActivityData = {
  myReviews: { id: number; perfume: string; content: string }[];
  myPosts: { id: number; title: string; content: string }[];
  myComments: { id: number; postId: number; content: string }[];
  likedPerfumes: { id: number; name: string }[];
  likedPosts: { id: number; title: string }[];
};

export const ActivitySection = ({ data }: { data: ActivityData }) => {
  return (
    <SubTabSwitcher
      defaultKey="myReviews"
      tabs={[
        {
          key: "myReviews",
          label: "나의 리뷰",
          content: (
            <ul className="space-y-2">
              {data.myReviews.map((item) => (
                <li key={item.id} className="border p-3 rounded-md bg-gray-50">
                  <strong>{item.perfume}</strong>: {item.content}
                </li>
              ))}
            </ul>
          ),
        },
        {
          key: "myPosts",
          label: "내가 쓴 게시글",
          content: (
            <ul className="space-y-2">
              {data.myPosts.map((item) => (
                <li key={item.id} className="border p-3 rounded-md bg-white">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          key: "myComments",
          label: "내가 쓴 댓글",
          content: (
            <ul className="space-y-2">
              {data.myComments.map((item) => (
                <li key={item.id} className="border p-3 rounded-md bg-gray-50">
                  <p className="text-sm">{item.content}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          key: "likedPerfumes",
          label: "좋아요 한 향수",
          content: (
            <ul className="grid grid-cols-5 gap-4">
              {data.likedPerfumes.map((item) => (
                <li key={item.id} className="border p-4 rounded-md bg-white">
                  {item.name}
                </li>
              ))}
            </ul>
          ),
        },
        {
          key: "likedPosts",
          label: "좋아요 한 글",
          content: (
            <ul className="space-y-2">
              {data.likedPosts.map((item) => (
                <li key={item.id} className="border p-3 rounded-md bg-gray-50">
                  {item.title}
                </li>
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
};
