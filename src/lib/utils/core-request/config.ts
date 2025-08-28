export interface LibraryConfig {
  baseUrl: string;
  tokenProvider?: () => string | null;
  refreshToken?: () => Promise<void>;
  debug?: boolean;
}
