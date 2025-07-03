import { VersionConfig } from "@feature-list/define";

/**
 * 加载单个版本配置文件
 */
export const loadVersionConfig = async (
  jsonName: string
): Promise<VersionConfig | null> => {
  try {
    const response = await fetch(`/${jsonName}.json`);
    if (!response.ok) {
      console.warn(
        `Version config ${jsonName}.json not found or not accessible`
      );
      return null;
    }
    const config = (await response.json()) as VersionConfig;

    // 验证基本结构
    if (!config.name || !config.features) {
      console.warn(`Invalid config structure in ${jsonName}.json`);
      return null;
    }

    return {
      ...config,
      version: jsonName, // 确保 version 字段存在
    } as VersionConfig;
  } catch (error) {
    console.error(`Error loading ${jsonName}.json:`, error);
    return null;
  }
};

/**
 * 加载版本列表文件
 */
export const loadVersionList = async (): Promise<string[]> => {
  try {
    const response = await fetch("/list.json");
    if (!response.ok) {
      throw new Error("Failed to load list.json");
    }
    const listData = (await response.json()) as string[];

    // 验证数据结构
    if (!Array.isArray(listData)) {
      throw new Error("list.json must contain an array");
    }

    return listData;
  } catch (error) {
    console.error("Error loading version list:", error);
    throw error;
  }
};

/**
 * 递归加载所有版本配置
 */
export const loadAllVersionConfigs = async (): Promise<VersionConfig[]> => {
  try {
    const versionList = await loadVersionList();

    const configPromises = versionList.map(async (item) => {
      const config = await loadVersionConfig(item);
      if (!config) {
        console.warn(`Skipping version ${item} due to load failure`);
        return null;
      }

      return config;
    });

    const results = await Promise.all(configPromises);
    return results.filter(Boolean) as any[];
  } catch (error) {
    console.error("Error loading all version configs:", error);
    throw error;
  }
};
