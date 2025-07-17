import type { VersionItem } from "../type";

const mockList: VersionItem[] = [
  {
    id: "1752739487698",
    name: "community",
    desc: "",
    features: {
      dashboard: {
        enabled: true,
        config: {
          maxItems: 2,
        },
      },
      projects: {
        enabled: true,
        config: {
          canCreate: true,
        },
      },
      code: {
        enabled: true,
        repos: {
          enabled: true,
        },
        lfs: {
          enabled: false,
          config: {
            maxFileSize: 100,
          },
        },
      },
      docs: {
        enabled: true,
        config: {
          mode: "rich-text",
        },
      },
    },
    createdAt: 1752739487698,
  },
  {
    id: "1752739437903",
    name: "enterprise",
    desc: "企业版",
    features: {
      dashboard: {
        enabled: true,
        config: {
          maxItems: 5,
        },
      },
      projects: {
        enabled: true,
        config: {
          canCreate: true,
        },
      },
      code: {
        enabled: true,
        repos: {
          enabled: true,
        },
        lfs: {
          enabled: true,
          config: {
            maxFileSize: 122,
          },
        },
      },
      docs: {
        enabled: true,
        config: {
          mode: "markdown",
        },
      },
    },
    createdAt: 1752739437903,
  },
];

export default mockList;
