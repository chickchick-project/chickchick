export type CacheKey = string;

function createCacheKey(args: unknown[]): CacheKey {
  return JSON.stringify(args);
}

function createLRUCache<K extends string, V>(maxSize: number = 50) {
  const cache = new Map<K, V>();

  const get = (key: K): V | undefined => {
    const value = cache.get(key);
    if (value !== undefined) {
      cache.delete(key);
      cache.set(key, value);
    }
    return value;
  };

  const set = (key: K, value: V): void => {
    if (cache.has(key)) {
      cache.delete(key);
    } else if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      if (typeof oldestKey === "string") {
        cache.delete(oldestKey as K);
      }
    }
    cache.set(key, value);
  };

  return { get, set };
}

export function withCache<P extends unknown[], R>(
  fn: (...args: P) => Promise<R>
) {
  type FnArgs = P; // 함수의 인자 타입
  type FnReturn = R; // 함수의 반환 타입

  const cache = createLRUCache<CacheKey, FnReturn>();

  return async (...args: FnArgs): Promise<FnReturn> => {
    const key = createCacheKey(args);

    const cached = cache.get(key);
    console.log(`[withCache] 캐시 HIT - key:`, key);
    if (cached) return cached;

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
}
