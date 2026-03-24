let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

type RefreshFn = () => Promise<void>;

/**
 * 토큰 갱신을 관리하는 함수
 * @param refreshToken 토큰 갱신 함수
 * @returns 토큰 갱신이 완료될 때까지의 Promise
 */
export function manageTokenRefresh(refreshToken: RefreshFn): Promise<void> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken().finally(() => {
      isRefreshing = false;
    });
  }

  return refreshPromise!;
}
