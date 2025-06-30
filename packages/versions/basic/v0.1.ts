import { VersionConfig } from "../src/types/feature";

/**
 * 基础版本 v0.1 配置
 * 提供最基本的功能集合
 */
export const basicV01: VersionConfig = {
  version: "basic-v0.1",
  name: "基础版 v0.1",
  features: [
    {
      id: "auth",
      enabled: true,
      version: "0.1.0",
      config: {
        sso: false,
        ldap: false,
        oauth: {
          google: false,
          github: false,
        },
      },
    },
    {
      id: "dashboard",
      enabled: true,
      version: "0.1.0",
      config: {
        widgets: ["chart", "table"],
        customizable: false,
      },
    },
    {
      id: "reports",
      enabled: true,
      version: "0.1.0",
      config: {
        export: false,
        schedule: false,
        customFields: false,
      },
    },
    {
      id: "advanced-reports",
      enabled: false,
      version: "0.1.0",
    },
    {
      id: "api-management",
      enabled: false,
      version: "0.1.0",
    },
  ],
};

export default basicV01;
