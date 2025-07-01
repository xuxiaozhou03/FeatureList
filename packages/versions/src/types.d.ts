import { IVersionConfig, FeatureConfig } from "@feature-list/shared";

/**
 * 基础版本配置类型
 * 根据 basic.json 的实际结构定义
 */
export interface VersionConfig extends IVersionConfig {
  /** 主题配置 */
  theme?: {
    primaryColor: string;
    backgroundColor: string;
  };
  features: {
    "user-management": FeatureConfig<{
      /** 最大用户数 */
      maxUsers: number | "unlimited";
      /** 是否允许批量操作 */
      allowBatchOperations: boolean;
      /** 角色管理（可选） */
      roleManagement?: boolean;
      /** SSO集成（可选） */
      ssoIntegration?: boolean;
      /** LDAP支持（可选） */
      ldapSupport?: boolean;
      /** 审计日志（可选） */
      auditLog?: boolean;
    }>;
    "basic-dashboard": FeatureConfig<{
      /** 刷新间隔（毫秒） */
      refreshInterval: number;
      /** 最大图表数 */
      maxCharts: number | "unlimited";
    }>;
    "file-upload": FeatureConfig<{
      /** 最大文件大小 */
      maxFileSize: string;
      /** 允许的文件类型 */
      allowedTypes: string[];
      /** 支持多文件上传（可选） */
      multipleFiles?: boolean;
      /** 拖拽上传（可选） */
      dragAndDrop?: boolean;
      /** 病毒扫描（可选） */
      virusScanning?: boolean;
      /** 版本控制（可选） */
      versionControl?: boolean;
      /** 访问控制（可选） */
      accessControl?: boolean;
    }>;
    "advanced-dashboard": FeatureConfig<{
      /** 刷新间隔（毫秒） */
      refreshInterval: number;
      /** 最大图表数 */
      maxCharts: number | "unlimited";
      /** 导出格式 */
      exportFormats: string[];
      /** 实时更新（可选） */
      realTimeUpdates?: boolean;
      /** 自定义小部件（可选） */
      customWidgets?: boolean;
      /** 数据连接器（可选） */
      dataConnectors?: string[];
      /** 警报功能（可选） */
      alerting?: boolean;
    }>;
    "batch-operations": FeatureConfig<{
      /** 最大批量大小 */
      maxBatchSize: number | "unlimited";
      /** 支持的操作类型 */
      supportedOperations: string[];
      /** 进度跟踪（可选） */
      progressTracking?: boolean;
      /** 错误处理（可选） */
      errorHandling?: boolean;
      /** 回滚支持（可选） */
      rollbackSupport?: boolean;
      /** 调度（可选） */
      scheduling?: boolean;
    }>;
    "data-export": FeatureConfig<{
      /** 支持的格式 */
      formats: string[];
      /** 最大记录数 */
      maxRecords: number | "unlimited";
      /** 定时导出（可选） */
      scheduledExport?: boolean;
      /** 数据同步（可选） */
      dataSync?: boolean;
      /** 加密（可选） */
      encryption?: boolean;
      /** 压缩格式（可选） */
      compressionFormats?: string[];
    }>;
  };
}
