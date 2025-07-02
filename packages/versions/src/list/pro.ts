import { VersionConfig } from "../types";

export const pro: VersionConfig = {
  version: "pro",
  name: "专业版本",
  description: "提供专业级功能和支持，适合中小型企业和团队使用",
  features: {
    "user-management": {
      name: "用户管理",
      enabled: true,
      description: "提供用户管理功能，包括权限控制和角色分配",
      params: {
        maxUsers: 500,
        allowBatchOperations: true,
        roleManagement: true,
        ssoIntegration: true,
        ldapSupport: true,
        auditLog: true,
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
        maxFileSize: "50MB",
        allowedTypes: ["jpg", "png", "pdf", "docx"],
        multipleFiles: true,
        dragAndDrop: true,
        virusScanning: true,
        versionControl: true,
        accessControl: true,
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
        realTimeUpdates: true,
        customWidgets: true,
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
        maxRecords: 0, // 0表示无限制
      },
    },
  },
};
