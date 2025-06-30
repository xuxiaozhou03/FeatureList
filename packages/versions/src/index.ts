// 导出类型定义
export * from "./types/feature";

// 导出配置管理
export * from "./configs";

// 导出工具类
export { VersionManager } from "./utils/VersionManager";
export { VersionComparator, type VersionDiff } from "./utils/VersionComparator";

// 默认导出
export { getDefaultVersion as default } from "./configs";
