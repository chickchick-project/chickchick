import {
  SearchPerfumesParams,
  SearchPerfumesWithFiltersParams,
} from "@/lib/types/search.types";
import type { FilterRequestBody } from "@/lib/hono/schemas/filter.schema";

import { stableStringify } from "./stableStringify";

interface PerfumeFilters {
  brands?: string[];
  notes?: string[];
  accords?: string[];
}

interface PostFilters {
  category?: string;
  sortBy?: string;
}

// 키를 안정적으로 직렬화하는 헬퍼
const createBase = <T extends string>(key: T) => [key] as const;

// userId를 안정적으로 직렬화하는 헬퍼
const getUserId = (userId?: string) => userId ?? "me";

const userBase = createBase("user");
const perfumeBase = createBase("perfumes");
const communityBase = createBase("community");
const brandBase = createBase("brands");
const filterBase = createBase("filter");
const searchBase = createBase("search");
const reviewBase = createBase("reviews");
const collectionBase = createBase("collection");
const draftsBase = createBase("drafts");

export const queryKeys = {
  // User
  user: {
    all: userBase,
    profile: (userId: string) => [...userBase, "profile", userId] as const,

    // Reviews
    reviews: (userId?: string) =>
      [...userBase, getUserId(userId), "reviews"] as const,

    // Posts
    posts: (userId?: string) =>
      [...userBase, getUserId(userId), "posts"] as const,

    // Comments
    comments: (userId?: string) =>
      [...userBase, getUserId(userId), "comments"] as const,

    // Likes
    likes: {
      all: (userId?: string) =>
        [...userBase, getUserId(userId), "likes"] as const,
      perfumes: (userId?: string) =>
        [...userBase, getUserId(userId), "likes", "perfumes"] as const,
      posts: (userId?: string) =>
        [...userBase, getUserId(userId), "likes", "posts"] as const,
    },

    // Bookmarks
    bookmarks: {
      all: (userId?: string) =>
        [...userBase, getUserId(userId), "bookmarks"] as const,
      perfumes: (userId?: string) =>
        [...userBase, getUserId(userId), "bookmarks", "perfumes"] as const,
      posts: (userId?: string) =>
        [...userBase, getUserId(userId), "bookmarks", "posts"] as const,
    },

    // Recents
    recents: {
      perfumes: (userId?: string) =>
        [...userBase, getUserId(userId), "recents", "perfumes"] as const,
      posts: (userId?: string) =>
        [...userBase, getUserId(userId), "recents", "posts"] as const,
    },
  },

  // Perfume
  perfume: {
    all: perfumeBase,
    lists: () => [...perfumeBase, "list"] as const,
    searchResult: (params: {
      searchKeyword: string;
      filters: PerfumeFilters;
    }) => [...perfumeBase, "searchResult", stableStringify(params)] as const,
    detail: (id: string) => [...perfumeBase, "detail", id] as const,
    reviews: (perfumeId: string) =>
      [...perfumeBase, "reviews", perfumeId] as const,
    brandDetail: (brandName: string) =>
      [...perfumeBase, "brandDetail", brandName] as const,
  },

  // Community
  community: {
    all: communityBase,
    lists: () => [...communityBase, "posts"] as const,
    posts: (params: { searchKeyword: string; filters?: PostFilters }) =>
      [...communityBase, "posts", stableStringify(params)] as const,
    post: (id: string) => [...communityBase, "post", id] as const,
    postStatus: (id: string) =>
      [...communityBase, "post", id, "status"] as const,
    postCategoryPosts: (id: string) =>
      [...communityBase, "post", id, "categoryPosts"] as const,
    comments: (postId: string) =>
      [...communityBase, "post", postId, "comments"] as const,
  },

  // Brand
  brand: {
    all: brandBase,
    list: () => [...brandBase, "list"] as const,
    detail: (id: string) => [...brandBase, "detail", id] as const,
    byName: (nameKo: string) => [...brandBase, "byName", nameKo] as const,
  },

  // Filter
  filter: {
    brands: () => [...filterBase, "brand", "list"] as const,
    notes: () => [...filterBase, "perfume", "notes"] as const,
    accords: () => [...filterBase, "perfume", "accords"] as const,
    available: (params: FilterRequestBody) =>
      [...filterBase, "available", stableStringify(params)] as const,
    total: (params: FilterRequestBody) =>
      [...filterBase, "total", stableStringify(params)] as const,
  },

  // Search
  search: {
    perfumes: (params: SearchPerfumesParams) =>
      [...searchBase, "perfumes", stableStringify(params)] as const,
    perfumesFiltered: (params: SearchPerfumesWithFiltersParams) =>
      [...searchBase, "perfumes", "filtered", stableStringify(params)] as const,
  },

  // Review
  review: {
    all: reviewBase,
    popular: () => [...reviewBase, "popular"] as const,
  },

  // Collection
  collection: {
    all: collectionBase,
    searchByPerfume: (query: string) =>
      [...collectionBase, "searchByPerfume", query] as const,
    byUserId: (userId: string) =>
      [...collectionBase, "byUserId", userId] as const,
  },

  // Drafts
  drafts: {
    all: draftsBase,
    list: () => [...draftsBase, "list"] as const,
    detail: (id: string) => [...draftsBase, id] as const,
  },
} as const;
