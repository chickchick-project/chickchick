export interface LibraryConfig {
  baseUrl: string;
  tokenProvider: () => string | null;
  refreshToken?: () => Promise<void>;
  debug?: boolean;
}

// const internalConfig: LibraryConfig = {
//   baseUrl: "",
//   tokenProvider: () => null,
//   refreshToken: async () => {},
// };

// export function configure(options: Partial<LibraryConfig>) {
//   Object.assign(internalConfig, options);
// }

// const config = {
//   get baseUrl() {
//     return internalConfig.baseUrl;
//   },
//   get tokenProvider() {
//     return internalConfig.tokenProvider;
//   },
//   get refreshToken() {
//     return internalConfig.refreshToken;
//   },
// };
// export default Object.freeze(config);
