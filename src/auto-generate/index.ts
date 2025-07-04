// 基于功能清单动态生成的 TypeScript 类型定义
// 生成时间: 2025/7/4 16:55:09
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

interface ProjectsPipelinesFeatureParams {
  /** 最大流水线数量 */
  maxPipelines: number;
  /** 并发构建数量 */
  concurrentBuilds: number;
  /** 构建超时时间（秒） */
  buildTimeout: number;
  /** 支持的运行器类型 */
  supportedRunners: Array<"docker" | "shell" | "kubernetes">;
}
interface DashboardFeature {
  /** 是否启用此功能 */
  enabled: boolean;
  /** 功能参数配置 */
  params: {
    /** 布局方式 */
    layout: "grid" | "list" | "card";
    /** 刷新间隔（秒） */
    refreshInterval?: number;
    /** 启用的组件列表 */
    widgets?: Array<string>;
  };
}
interface ProjectsFeature {
  /** 是否启用此功能 */
  enabled: boolean;
  /** 功能参数配置 */
  params: {
    /** 最大项目数量 */
    maxProjects: number;
    /** 支持的可见性级别 */
    visibility?: Array<"public" | "private" | "internal">;
    /** 是否支持项目模板 */
    templates?: boolean;
  };
  /** 子功能配置 */
  children?: {
    pipelines: {
      /** 是否启用此功能 */
      enabled: boolean;
      /** 功能参数配置 */
      params: ProjectsPipelinesFeatureParams;
    };
  };
}
interface ProjectsPipelinesFeature {
  /** 是否启用此功能 */
  enabled: boolean;
  /** 功能参数配置 */
  params: ProjectsPipelinesFeatureParams;
}

interface VersionConfig {
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
        /** 布局方式 */
        layout: "grid" | "list" | "card";
        /** 刷新间隔（秒） */
        refreshInterval?: number;
        /** 启用的组件列表 */
        widgets?: Array<string>;
      };
    };
    projects: {
      /** 是否启用此功能 */
      enabled: boolean;
      /** 功能参数配置 */
      params: {
        /** 最大项目数量 */
        maxProjects: number;
        /** 支持的可见性级别 */
        visibility?: Array<"public" | "private" | "internal">;
        /** 是否支持项目模板 */
        templates?: boolean;
      };
      /** 子功能配置 */
      children?: {
        pipelines: {
          /** 是否启用此功能 */
          enabled: boolean;
          /** 功能参数配置 */
          params: ProjectsPipelinesFeatureParams;
        };
      };
    };
  };
}

// 导出主要类型
export type {
  VersionConfig,
  BaseFeature,
  FeatureParams,
  FeatureEnabled,
  ProjectsPipelinesFeatureParams,
};

// 默认导出
export default VersionConfig;
