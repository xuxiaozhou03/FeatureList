// 基于功能清单动态生成的 TypeScript 类型定义
// 生成时间: 2025/7/7 16:19:58
// Schema Title: 版本配置
// Schema Description: 完整的版本配置结构，包含版本信息和具体的功能配置

/** 功能启用状态 */
type FeatureEnabled = boolean;

/** 功能参数配置 */
interface FeatureParams {
  [key: string]: any;
}

/** 基础功能配置 */
interface BaseFeature {
  /** 是否启用此功能 */
  enabled: FeatureEnabled;
  /** 功能参数配置 */
  params?: FeatureParams;
}

export interface DashboardFeature {
  /** 是否启用此功能 */
  enabled: boolean;
  /** 功能参数配置 */
  params: {
    layout: "grid" | "list" | "card";
    refreshInterval?: number;
    widgets?: Array<string>;
  };
}
export interface ProjectsFeature {
  /** 是否启用此功能 */
  enabled: boolean;
  /** 功能参数配置 */
  params: {
    maxProjects: number;
    visibility?: Array<"public" | "private" | "internal">;
    templates?: boolean;
  };
}

export interface VersionConfig {
  /** 版本标识符 */
  version: string; // Pattern: ^\d+\.\d+\.\d+$;
  /** 版本名称 */
  name: string;
  /** 版本描述 */
  description: string;
  /** 功能配置对象 */
  features: {
    dashboard: {
      /** 是否启用此功能 */
      enabled: boolean;
      /** 功能参数配置 */
      params: {
        layout: "grid" | "list" | "card";
        refreshInterval?: number;
        widgets?: Array<string>;
      };
    };
    projects: {
      /** 是否启用此功能 */
      enabled: boolean;
      /** 功能参数配置 */
      params: {
        maxProjects: number;
        visibility?: Array<"public" | "private" | "internal">;
        templates?: boolean;
      };
    };
  };
}

// 导出主要类型
export type { BaseFeature, FeatureParams, FeatureEnabled };

// 默认导出
export default VersionConfig;
