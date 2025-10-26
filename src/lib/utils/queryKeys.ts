const userBase = ["user"] as const;
const perfumeBase = ["perfumes"] as const;
const communityBase = ["community"] as const;

export const queryKeys = {
  // User
  user: {
    all: userBase,
    profile: (userId: string) => [...userBase, "profile", userId] as const,

    // Reviews
    reviews: (userId?: string) =>
      [...userBase, userId ?? "me", "reviews"] as const,

    // Posts
    posts: (userId?: string) => [...userBase, userId ?? "me", "posts"] as const,

    // Comments
    comments: (userId?: string) =>
      [...userBase, userId ?? "me", "comments"] as const,

    // Likes
    likes: {
      perfumes: (userId?: string) =>
        [...userBase, userId ?? "me", "likes", "perfumes"] as const,
      posts: (userId?: string) =>
        [...userBase, userId ?? "me", "likes", "posts"] as const,
    },

    // Bookmarks
    bookmarks: {
      all: (userId?: string) =>
        [...userBase, "bookmarks", userId ?? "me"] as const,
      perfumes: (userId?: string) =>
        [...userBase, "bookmarks", userId ?? "me", "perfumes"] as const,
      posts: (userId?: string) =>
        [...userBase, "bookmarks", userId ?? "me", "posts"] as const,
    },

    // Collections
    collections: {
      all: () => [...userBase, "collections"] as const,
      byUserId: (userId: string) =>
        [...userBase, "collections", userId] as const,
    },

    // Recents
    recents: {
      perfumes: (userId?: string) =>
        [...userBase, userId ?? "me", "recents", "perfumes"] as const,
      posts: (userId?: string) =>
        [...userBase, userId ?? "me", "recents", "posts"] as const,
    },
  },

  // Perfume
  perfume: {
    all: perfumeBase,
    lists: () => [...perfumeBase, "list"] as const,
    list: (searchKeyword: string, filters: Record<string, string[]>) =>
      [...perfumeBase, "list", searchKeyword, JSON.stringify(filters)] as const,
    detail: (id: string) => [...perfumeBase, "detail", id] as const,
    reviews: (perfumeId: string) =>
      [...perfumeBase, "reviews", perfumeId] as const,
    brandDetail: (brandName: string) =>
      [...perfumeBase, "brandDetail", brandName] as const,
  },

  // Community
  community: {
    all: communityBase,
    posts: (
      searchKeyword: string,
      filters: { category?: string; sortBy?: string }
    ) => [...communityBase, "posts", searchKeyword, filters] as const,
    post: (id: string) => [...communityBase, "post", id] as const,
    postStatus: (id: string) =>
      [...communityBase, "post", id, "status"] as const,
    comments: (postId: string) =>
      [...communityBase, "post", postId, "comments"] as const,
  },
} as const;
