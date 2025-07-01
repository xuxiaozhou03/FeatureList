import { VersionConfig } from "../types";

/**
 * 基础版本配置
 * 提供基础功能的入门版本
 */
export const basic: VersionConfig = {
  version: "basic",
  name: "基础版本",
  description: "提供基础功能的入门版本",
  theme: {
    primaryColor: "#007bff",
    backgroundColor: "#f8f9fa",
  },
  features: {
    "user-management": {
      name: "用户管理",
      enabled: true,
      description: "基础的用户增删改查功能",
      params: {
        maxUsers: 100,
        allowBatchOperations: false,
      },
    },
    "basic-dashboard": {
      name: "基础仪表板",
      enabled: true,
      description: "简单的数据展示面板",
      params: {
        refreshInterval: 60000,
        maxCharts: 4,
      },
    },
    "file-upload": {
      name: "文件上传",
      enabled: false,
      description: "单文件上传功能",
      params: {
        maxFileSize: "10MB",
        allowedTypes: ["jpg", "png", "pdf"],
      },
    },
    "advanced-dashboard": {
      name: "高级仪表板",
      enabled: false,
      description: "高级数据分析和可视化",
      params: {
        refreshInterval: 30000,
        maxCharts: 12,
        exportFormats: ["png", "pdf"],
      },
    },
    "batch-operations": {
      name: "批量操作",
      enabled: false,
      description: "批量处理和操作功能",
      params: {
        maxBatchSize: 1000,
        supportedOperations: ["import", "export", "delete"],
      },
    },
    "data-export": {
      name: "数据导出",
      enabled: false,
      description: "数据导出功能",
      params: {
        formats: ["csv", "excel"],
        maxRecords: 10000,
      },
    },
  },
};
