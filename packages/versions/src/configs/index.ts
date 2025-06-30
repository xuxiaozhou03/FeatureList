import { VersionConfig } from "../types/feature";

// 导入配置文件
import basicConfig from "../../configs/basic.json";
import enterpriseConfig from "../../configs/enterprise.json";

// 版本配置映射
export const versionConfigs: Record<string, VersionConfig> = {
  basic: basicConfig as VersionConfig,
  enterprise: enterpriseConfig as VersionConfig,
};

// 获取所有版本
export function getAllVersions(): string[] {
  return Object.keys(versionConfigs);
}

// 获取版本配置
export function getVersionConfig(version: string): VersionConfig | undefined {
  return versionConfigs[version];
}

// 获取默认版本
export function getDefaultVersion(): VersionConfig {
  return versionConfigs.basic;
}

// 验证版本是否存在
export function isValidVersion(version: string): boolean {
  return version in versionConfigs;
}
