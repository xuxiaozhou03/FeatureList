import { VersionConfig } from "../src/types/feature";

/**
 * 企业版本 v0.1 配置
 * 提供完整的企业级功能
 */
export const enterpriseV01: VersionConfig = {
  version: "enterprise-v0.1",
  name: "企业版 v0.1",
  features: [
    {
      id: "auth",
      enabled: true,
      version: "0.1.0",
      config: {
        sso: true,
        ldap: true,
        oauth: {
          google: true,
          github: true,
        },
      },
    },
    {
      id: "dashboard",
      enabled: true,
      version: "0.1.0",
      config: {
        widgets: ["chart", "table", "kpi", "calendar"],
        customizable: true,
      },
    },
    {
      id: "reports",
      enabled: true,
      version: "0.1.0",
      config: {
        export: true,
        schedule: true,
        customFields: true,
      },
    },
    {
      id: "advanced-reports",
      enabled: true,
      version: "0.1.0",
      config: {
        analytics: true,
        charts: ["line", "bar", "pie", "scatter"],
        realtime: true,
      },
    },
    {
      id: "api-management",
      enabled: true,
      version: "0.1.0",
      config: {
        rateLimit: true,
        monitoring: true,
        documentation: true,
      },
    },
  ],
};

export default enterpriseV01;
