import type { AppConfig } from "../types/config";

export default {
  version: "community",
  features: {
    dashboard: {
      enabled: true,
      params: {
        widgets: ["overview", "recent"],
        theme: "basic",
      },
    },
    projects: {
      enabled: true,
      params: {
        maxProjects: 5,
        templates: ["basic"],
      },
      children: {
        pipelines: {
          enabled: true,
          params: {
            maxPipelines: 3,
            concurrent: 1,
          },
        },
      },
    },
    issues: {
      enabled: true,
      params: {
        maxIssues: 100,
        workflowTypes: ["basic"],
      },
    },
    code: {
      enabled: false,
      params: {},
    },
  },
} as AppConfig;
