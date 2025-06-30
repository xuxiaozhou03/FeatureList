import type { ComponentType } from "react";

export interface BaseFeatureConfig {
  id: string;
  enabled: boolean;
  version?: string;
  dependencies?: string[];
}

// 认证功能配置
export interface AuthFeatureConfig extends BaseFeatureConfig {
  id: "auth";
  config?: {
    sso?: boolean;
    ldap?: boolean;
    oauth?: {
      google?: boolean;
      github?: boolean;
    };
  };
}

// 仪表盘功能配置
export interface DashboardFeatureConfig extends BaseFeatureConfig {
  id: "dashboard";
  config?: {
    widgets?: string[];
    customizable?: boolean;
  };
}

// 报表功能配置
export interface ReportsFeatureConfig extends BaseFeatureConfig {
  id: "reports";
  config?: {
    export?: boolean;
    schedule?: boolean;
    customFields?: boolean;
  };
}

// 高级报表功能配置
export interface AdvancedReportsFeatureConfig extends BaseFeatureConfig {
  id: "advanced-reports";
  config?: {
    analytics?: boolean;
    charts?: string[];
    realtime?: boolean;
  };
}

// API管理功能配置
export interface ApiManagementFeatureConfig extends BaseFeatureConfig {
  id: "api-management";
  config?: {
    rateLimit?: boolean;
    monitoring?: boolean;
    documentation?: boolean;
  };
}

// 联合类型，确保类型安全
export type FeatureConfig =
  | AuthFeatureConfig
  | DashboardFeatureConfig
  | ReportsFeatureConfig
  | AdvancedReportsFeatureConfig
  | ApiManagementFeatureConfig;

// 功能ID类型
export type FeatureId = FeatureConfig["id"];

// 版本配置
export interface VersionConfig {
  version: string;
  name: string;
  features: FeatureConfig[];
}

// 路由配置
export interface RouteConfig {
  path: string;
  component: ComponentType;
  feature?: string;
  exact?: boolean;
  children?: RouteConfig[];
}

// 功能模块接口
export interface FeatureModule {
  id: string;
  name: string;
  routes?: RouteConfig[];
  components?: Record<string, ComponentType>;
  initialize?: (app: any) => void;
}
