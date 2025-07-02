/**
 * 动态模块加载器
 * 根据当前版本自动加载对应的模块文件
 */

import type { VersionType } from "../types/config";

/**
 * 获取版本类型
 * 如果版本不是 community 或 enterprise，则默认为 professional
 */
function getVersionType(version?: string): VersionType {
  const currentVersion = version || process.env.VERSION || "community";

  if (currentVersion === "community") return "community";
  if (currentVersion === "enterprise") return "enterprise";

  // 其他任何版本都映射为 professional
  return "professional";
}

export async function loadModule<T>(modulePath: string): Promise<T> {
  const versionType = getVersionType();

  // 尝试加载版本特定文件
  try {
    const versionModule = await import(`${modulePath}.${versionType}`);
    return versionModule.default || versionModule;
  } catch {
    // 回退到默认文件
    const defaultModule = await import(modulePath);
    return defaultModule.default || defaultModule;
  }
}

/**
 * 创建动态导入的包装器
 * 用于在编译时就确定可能的导入路径
 */
export function createDynamicImporter<T>(baseModulePath: string) {
  return async (): Promise<T> => {
    return loadModule<T>(baseModulePath);
  };
}

/**
 * 检查当前环境
 */
export function getCurrentEnvironment() {
  const version = process.env.VERSION || "community";
  const versionType = getVersionType(version);

  return {
    version,
    versionType,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
  };
}

export { getVersionType };
