import { cache } from "react";
import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1분 - 데이터가 신선한 것으로 간주되는 시간
          gcTime: 5 * 60 * 1000, // 5분 - 캐시 가비지 컬렉션 시간
          refetchOnWindowFocus: false, // 불필요한 재페치 방지
          retry: 1, // 실패 시 재시도 횟수 감소로 빠른 실패 처리
        },
        dehydrate: {
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending",
        },
      },
    })
);

export default getQueryClient;
