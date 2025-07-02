import type { AppConfig } from "../types/config";

export default {
  version: "enterprise",
  features: {
    dashboard: {
      enabled: true,
      params: {
        widgets: ["overview", "recent", "analytics", "reports"],
        theme: "enterprise",
      },
    },
    projects: {
      enabled: true,
      params: {
        maxProjects: 100,
        templates: ["basic", "enterprise", "devops"],
      },
      children: {
        pipelines: {
          enabled: true,
          params: {
            maxPipelines: 50,
            concurrent: 5,
          },
        },
      },
    },
    issues: {
      enabled: true,
      params: {
        maxIssues: 10000,
        workflowTypes: ["basic", "kanban", "scrum"],
      },
    },
    code: {
      enabled: true,
      params: {
        repositories: true,
        codeReview: true,
        branches: "unlimited",
      },
    },
  },
} as AppConfig;
