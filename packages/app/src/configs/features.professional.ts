import type { AppConfig } from "../types/config";

export default {
  version: "professional",
  features: {
    dashboard: {
      enabled: true,
      params: {
        widgets: [
          "overview",
          "recent",
          "analytics",
          "reports",
          "advanced",
          "ai-insights",
        ],
        theme: "professional",
        customizable: true,
      },
    },
    projects: {
      enabled: true,
      params: {
        maxProjects: -1, // unlimited
        templates: ["basic", "enterprise", "devops", "microservices", "ai-ml"],
        advancedWorkflows: true,
      },
      children: {
        pipelines: {
          enabled: true,
          params: {
            maxPipelines: -1, // unlimited
            concurrent: 10,
            aiOptimization: true,
          },
        },
      },
    },
    issues: {
      enabled: true,
      params: {
        maxIssues: -1, // unlimited
        workflowTypes: ["basic", "kanban", "scrum", "custom"],
        aiAssistant: true,
      },
    },
    code: {
      enabled: true,
      params: {
        repositories: true,
        codeReview: true,
        branches: "unlimited",
        aiCodeAnalysis: true,
        securityScanning: true,
      },
    },
  },
} as AppConfig;
