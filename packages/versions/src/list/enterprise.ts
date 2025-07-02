import { VersionConfig } from "../types";

export const enterprise: VersionConfig = {
  version: "1.0.0",
  name: "企业版本",
  description: "提供全面的企业级功能和支持",
  features: {
    "user-management": {
      name: "用户管理",
      enabled: true,
      description: "全面的用户管理功能，包括权限控制和角色分配",
      params: {
        maxUsers: 1000,
        allowBatchOperations: true,
      },
    },
    "basic-dashboard": {
      name: "基础仪表板",
      enabled: true,
      description: "提供基础的数据展示和监控面板",
      params: {
        refreshInterval: 30000,
        maxCharts: 8,
      },
    },
    "file-upload": {
      name: "文件上传",
      enabled: true,
      description: "支持多文件上传和大文件处理",
      params: {
        maxFileSize: "100MB",
        allowedTypes: ["jpg", "png", "pdf", "docx"],
      },
    },
    "advanced-dashboard": {
      name: "高级仪表板",
      enabled: true,
      description: "提供高级数据分析、可视化和自定义报表功能",
      params: {
        refreshInterval: 15000,
        maxCharts: 20,
        exportFormats: ["png", "pdf", "xlsx"],
      },
    },
    "batch-operations": {
      name: "批量操作",
      enabled: true,
      description: "支持批量数据处理和操作，包括导入导出和删除",
      params: {
        maxBatchSize: 5000,
        supportedOperations: ["import", "export", "delete"],
      },
    },
    "data-export": {
      name: "数据导出",
      enabled: true,
      description: "支持多种格式的数据导出功能",
      params: {
        formats: ["csv", "json", "xml"],
        maxRecords: 0,
      },
    },
  },
};
