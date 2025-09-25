import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export const mockPostCardData: PostCardProps = {
  id: "7e314065-2f18-49b2-a55d-9b168d9cfe52",
  title: "화난 무민",
  content:
    '<figure class="image image_resized" style="width:10.72%;"><img style="aspect-ratio:453/336;" src="https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/post-image/1758279654182____________.webp" width="453" height="336"></figure>',
  userId: "dc9bb3fd-48c1-4044-8038-6141c00d1ff9",
  category: "QUESTION",
  published: true,
  viewCount: 5,
  likeCount: 0,
  commentCount: 1,
  thumbnailUrl:
    "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/post-image/1758279654182____________.webp",
  createdAt: new Date("2025-09-19T11:00:54.567Z"),
  updatedAt: new Date("2025-09-25T08:29:58.828Z"),
  contentText: "",
  author: {
    id: "dc9bb3fd-48c1-4044-8038-6141c00d1ff9",
    nickname: "김하은",
    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocLKak4Z58c-sEvRicBiir32K0nOsF4oA8nMp156tKR8eid5ZA=s96-c",
  },
  isAuthor: false,
};
