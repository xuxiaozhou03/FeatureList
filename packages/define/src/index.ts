import config from "./config.json";

export * from "./types";
export { config };

/**
 * 版本键类型定义
 * - community: 社区版
 * - enterprise: 企业版
 * - professional: 专业版
 */
export type VersionKey = "community" | "enterprise" | "professional";

export const defaultVersion: VersionKey = "enterprise";
