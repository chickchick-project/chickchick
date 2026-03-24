# HTTP Client Library

TypeScript 기반의 강력하고 유연한 HTTP 클라이언트 라이브러리입니다. 인터셉터, 자동 토큰 갱신, 타입 안전성을 제공합니다.

## 주요 기능

- ✨ **타입 안전성**: 완전한 TypeScript 지원
- 🔄 **자동 토큰 갱신**: 401 응답 시 자동으로 토큰 갱신 및 재시도
- 🎯 **인터셉터**: 요청/응답 인터셉터를 통한 커스터마이징
- 🔧 **응답 변환**: 응답 데이터 변환 기능
- 🌐 **Next.js 서버 지원**: Next.js 서버 컴포넌트를 위한 전용 클라이언트
- 📝 **FormData 지원**: JSON과 FormData 모두 지원

## 기본 사용법

### 클라이언트 생성

```typescript
import { createHttpClient } from "your-http-client-library";

const apiClient = createHttpClient({
  baseUrl: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  debug: true, // 디버그 로그 활성화 (선택)
});
```

### GET 요청

```typescript
// 기본 GET 요청
const users = await apiClient.get("/users");

// 쿼리 파라미터 사용
const filteredUsers = await apiClient.get("/users", {
  page: 1,
  limit: 10,
  status: "active",
});

// 타입 안전성과 함께 사용
interface User {
  id: number;
  name: string;
  email: string;
}

const users = await apiClient.get<User[]>("/users");
```

### POST 요청

```typescript
// JSON 데이터 전송
interface CreateUserRequest {
  name: string;
  email: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const newUser = await apiClient.post<CreateUserRequest, UserResponse>(
  "/users",
  {
    name: "John Doe",
    email: "john@example.com",
  }
);

// FormData 전송
const formData = new FormData();
formData.append("file", file);
formData.append("title", "My File");

const uploadResult = await apiClient.post("/upload", formData);
```

### PUT / PATCH 요청

```typescript
// PUT 요청 (전체 업데이트)
const updatedUser = await apiClient.put("/users/123", {
  name: "Jane Doe",
  email: "jane@example.com",
});

// PATCH 요청 (부분 업데이트)
const partialUpdate = await apiClient.patch("/users/123", {
  name: "Jane Smith",
});
```

### DELETE 요청

```typescript
// 삭제 요청
await apiClient.delete("/users/123");
```

## 고급 기능

### 응답 데이터 변환

```typescript
interface ApiResponse {
  data: User[];
  meta: { total: number };
}

const users = await apiClient.get<ApiResponse, User[]>(
  "/users",
  {},
  {
    transformResponse: (response) => response.data,
  }
);
// users는 User[] 타입
```

### 요청 인터셉터

```typescript
// 모든 요청에 Authorization 헤더 추가
apiClient.useRequestInterceptor((config) => {
  const token = localStorage.getItem("token");
  const headers = new Headers(config.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return {
    ...config,
    headers,
  };
});
```

### 응답 인터셉터

```typescript
// 모든 응답 로깅
apiClient.useResponseInterceptor((response) => {
  console.log("Response status:", response.status);
  return response;
});

// 에러 응답 처리
apiClient.useResponseInterceptor(async (response) => {
  if (response.status === 403) {
    console.error("Access forbidden");
    // 추가 처리 로직
  }
  return response;
});
```

### 자동 토큰 갱신

```typescript
const apiClient = createHttpClient({
  baseUrl: "https://api.example.com",
  refreshToken: async () => {
    // 토큰 갱신 로직
    const response = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.accessToken);
  },
});

// 401 응답 시 자동으로 토큰을 갱신하고 요청을 재시도합니다
const data = await apiClient.get("/protected-resource");
```

### Next.js 서버 컴포넌트 사용

```typescript
import { createApiServerClient } from "your-http-client-library/serverClient";

export default async function ServerComponent() {
  const apiClient = await createApiServerClient();

  const data = await apiClient.get("/server-data");

  return <div>{/* 렌더링 로직 */}</div>;
}
```

## 에러 처리

```typescript
import { APIError } from "your-http-client-library";

try {
  const data = await apiClient.get("/users");
} catch (error) {
  if (error instanceof APIError) {
    console.error("API Error:", {
      status: error.status,
      message: error.message,
      data: error.errorData,
    });

    // 상태 코드별 처리
    if (error.status === 404) {
      console.error("Resource not found");
    } else if (error.status === 500) {
      console.error("Server error");
    }
  } else {
    console.error("Unknown error:", error);
  }
}
```

## 설정 옵션

### LibraryConfig

```typescript
interface LibraryConfig {
  baseUrl: string; // API 기본 URL (필수)
  headers?: HeadersInit; // 기본 헤더
  tokenProvider?: () => string | null; // 토큰 제공 함수
  refreshToken?: () => Promise<void>; // 토큰 갱신 함수
  debug?: boolean; // 디버그 모드
}
```

### 요청 옵션

```typescript
interface GetApiOptions {
  cache?: RequestCache; // 캐시 설정
  headers?: HeadersInit; // 추가 헤더
  skipAuth?: boolean; // 인증 스킵
  transformResponse?: (response: RawData) => TransformedData;
}

interface MutateApiOptions {
  cache?: RequestCache;
  headers?: HeadersInit;
  transformResponse?: (response: RawData) => TransformedData;
}
```

## 예제

### 완전한 인증 플로우 예제

```typescript
const apiClient = createHttpClient({
  baseUrl: "https://api.example.com",
  debug: true,
  refreshToken: async () => {
    const response = await fetch("https://api.example.com/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      window.location.href = "/login";
      throw new Error("Refresh failed");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
  },
});

// Authorization 헤더 자동 추가
apiClient.useRequestInterceptor((config) => {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(config.headers);

  if (token && !config.skipAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return { ...config, headers };
});

// 사용
const userData = await apiClient.get("/user/me");
```

### React에서 사용하기

```typescript
// hooks/useApi.ts
import { createHttpClient } from "your-http-client-library";
import { useMemo } from "react";

export function useApiClient() {
  return useMemo(() => {
    const client = createHttpClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL!,
      refreshToken: async () => {
        // 토큰 갱신 로직
      },
    });

    client.useRequestInterceptor((config) => {
      // 인터셉터 로직
      return config;
    });

    return client;
  }, []);
}

// 컴포넌트에서 사용
function UserList() {
  const apiClient = useApiClient();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiClient.get("/users").then(setUsers);
  }, [apiClient]);

  return <div>{/* 렌더링 */}</div>;
}
```

## 라이센스

MIT
