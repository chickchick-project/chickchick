export interface LibraryConfig {
  baseUrl: string;
  headers?: HeadersInit;
  tokenProvider?: () => string | null;
  refreshToken?: () => Promise<void>;
  debug?: boolean;
}
