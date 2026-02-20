import { PostCategory } from "@prisma/client";

/**
 * 클라이언트에서 임시 저장할 때 사용하는 인터페이스
 */
export interface PostDraftInput {
  category: PostCategory | "";
  title: string;
  content: string;
  contentText: string;
  thumbnailUrl: string | null;
  perfumeIds?: string[];
  postId?: string;
}

/**
 * 임시 저장 API 응답 인터페이스
 */
export interface SaveDraftResponse {
  success: boolean;
  message: string;
  draft?: {
    id: string;
    userId: string;
    title: string;
    content: string;
    contentText: string;
    category: PostCategory;
    thumbnailUrl: string | null;
    perfumeIds: string[];
    postId: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
