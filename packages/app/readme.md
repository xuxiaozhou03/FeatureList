# 前端项目

## 概述

本项目采用多版本架构设计，支持根据平台变量和版本变量动态加载不同的功能配置和实现文件，实现一份代码支持多个版本部署的目标。

## 环境变量

### 平台变量（platform）

平台变量用于区分不同的产品版本，影响功能集合和 UI 展示：

- `community`: 社区版 - 免费基础功能版本
- `enterprise`: 企业版 - 商业版本，包含高级功能
- `professional`: 专业版 - 专业级完整功能版本

### 版本变量（version）

版本变量用于确定产品版本级别，支持三种版本：

- `community`: 社区版 - 基础功能
- `enterprise`: 企业版 - 商业功能
- 其他任何值: 自动映射为 `professional` 专业版 - 完整功能

## 使用方式

### 1. 环境变量设置

#### 开发环境

```bash
# 社区版
VERSION=community npm run dev

# 企业版
VERSION=enterprise npm run dev

# 专业版（任何其他版本值都会映射为专业版）
VERSION=professional npm run dev
VERSION=client-custom npm run dev  # 也会被识别为专业版
```

#### 生产环境

```bash
# 构建不同版本
npm run build:community
npm run build:enterprise
npm run build:professional
```

### 2. 代码中判断版本

```ts
// 版本检测函数
function getVersionType(
  version?: string
): "community" | "enterprise" | "professional" {
  const currentVersion = version || process.env.VERSION || "community";

  if (currentVersion === "community") return "community";
  if (currentVersion === "enterprise") return "enterprise";

  // 其他任何版本都映射为 professional
  return "professional";
}

// 使用示例
const versionType = getVersionType();

if (versionType === "community") {
  // 社区版逻辑
}

if (versionType === "enterprise") {
  // 企业版逻辑
}

if (versionType === "professional") {
  // 专业版逻辑（包含所有客户定制版本）
}
```

### 3. 动态文件加载机制

#### 基础原理

系统会根据当前的版本变量自动尝试加载对应的文件：

```ts
import A from "./test.ts";

// 当 VERSION=community 时，会尝试加载 ./test.community.ts
// 当 VERSION=enterprise 时，会尝试加载 ./test.enterprise.ts
// 当 VERSION=任何其他值 时，会尝试加载 ./test.professional.ts
// 如果特定版本文件不存在，则回退到 ./test.ts
```

#### 文件命名规范

```
src/
├── components/
│   ├── Header.tsx                 # 默认组件
│   ├── Header.community.tsx       # 社区版组件
│   ├── Header.enterprise.tsx      # 企业版组件
│   └── Header.professional.tsx    # 专业版组件
├── pages/
│   ├── Dashboard.tsx              # 默认页面
│   ├── Dashboard.community.tsx    # 社区版页面
│   ├── Dashboard.enterprise.tsx   # 企业版页面
│   └── Dashboard.professional.tsx # 专业版页面
├── configs/
│   ├── app.ts                     # 默认配置
│   ├── app.community.ts           # 社区版配置
│   ├── app.enterprise.ts          # 企业版配置
│   └── app.professional.ts        # 专业版配置（其他版本回退）
└── utils/
    ├── api.ts                     # 默认API工具
    ├── api.community.ts           # 社区版API
    └── api.enterprise.ts          # 企业版API
```

#### 加载优先级

1. **版本特定文件**: `filename.{community|enterprise|professional}.tsx`
2. **默认文件**: `filename.tsx`

注意：如果版本不是 `community` 或 `enterprise`，系统会尝试加载 `filename.professional.tsx`

#### 实现示例

```ts
// utils/dynamic-import.ts
function getVersionType(
  version?: string
): "community" | "enterprise" | "professional" {
  const currentVersion = version || process.env.VERSION || "community";

  if (currentVersion === "community") return "community";
  if (currentVersion === "enterprise") return "enterprise";

  return "professional"; // 其他任何版本都映射为 professional
}

export async function loadModule<T>(modulePath: string): Promise<T> {
  const versionType = getVersionType();

  // 尝试加载版本特定文件
  try {
    const versionModule = await import(`${modulePath}.${versionType}`);
    return versionModule.default || versionModule;
  } catch {}

  // 回退到默认文件
  const defaultModule = await import(modulePath);
  return defaultModule.default || defaultModule;
}
```

## 功能配置系统

### 配置文件结构

```ts
// types/config.ts
export interface FeatureConfig {
  enabled: boolean;
  params: Record<string, any>;
  children?: Record<string, FeatureConfig>;
}

export interface AppConfig {
  version: "community" | "enterprise" | "professional";
  features: {
    dashboard: FeatureConfig;
    projects: FeatureConfig;
    issues: FeatureConfig;
    code: FeatureConfig;
  };
}
```

### 版本配置示例

```ts
// configs/features.community.ts
export default {
  version: "community",
  features: {
    dashboard: {
      enabled: true,
      params: {
        widgets: ["overview", "recent"],
      },
    },
    projects: {
      enabled: true,
      params: {
        maxProjects: 5,
      },
      children: {
        pipelines: {
          enabled: true,
          params: {
            maxPipelines: 3,
          },
        },
      },
    },
    issues: {
      enabled: true,
      params: {
        maxIssues: 100,
      },
    },
    code: {
      enabled: false,
      params: {},
    },
  },
} as AppConfig;
```

```ts
// configs/features.enterprise.ts
export default {
  version: "enterprise",
  features: {
    dashboard: {
      enabled: true,
      params: {
        widgets: ["overview", "recent", "analytics", "reports"],
      },
    },
    projects: {
      enabled: true,
      params: {
        maxProjects: 100,
      },
      children: {
        pipelines: {
          enabled: true,
          params: {
            maxPipelines: 50,
          },
        },
      },
    },
    issues: {
      enabled: true,
      params: {
        maxIssues: 10000,
      },
    },
    code: {
      enabled: true,
      params: {
        repositories: true,
        codeReview: true,
      },
    },
  },
} as AppConfig;
```

### 全局配置加载器

```ts
// hooks/useConfig.ts
import { useState, useEffect } from "react";
import type { AppConfig } from "../types/config";

let configCache: AppConfig | null = null;

function getVersionType(
  version?: string
): "community" | "enterprise" | "professional" {
  const currentVersion = version || process.env.VERSION || "community";

  if (currentVersion === "community") return "community";
  if (currentVersion === "enterprise") return "enterprise";

  return "professional";
}

export async function loadConfig(): Promise<AppConfig> {
  if (configCache) return configCache;

  const versionType = getVersionType();

  try {
    // 尝试加载版本特定配置
    const versionConfig = await import(`../configs/features.${versionType}.ts`);
    configCache = versionConfig.default;
    return configCache;
  } catch {
    // 回退到默认配置
    const defaultConfig = await import("../configs/features.community.ts");
    configCache = defaultConfig.default;
    return configCache;
  }
}

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadConfig()
      .then(setConfig)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
```

### 功能特性 Hook

```ts
// hooks/useFeatures.ts
import { useConfig } from "./useConfig";
import type { FeatureConfig } from "../types/config";

export function useFeatures() {
  const { config, loading, error } = useConfig();

  const isFeatureEnabled = (featurePath: string): boolean => {
    if (!config) return false;

    const paths = featurePath.split(".");
    let current: any = config.features;

    for (const path of paths) {
      current = current?.[path];
      if (!current) return false;
    }

    return current.enabled === true;
  };

  const getFeatureParams = (featurePath: string): any => {
    if (!config) return {};

    const paths = featurePath.split(".");
    let current: any = config.features;

    for (const path of paths) {
      current = current?.[path];
      if (!current) return {};
    }

    return current.params || {};
  };

  const getFeatureConfig = (featurePath: string): FeatureConfig | null => {
    if (!config) return null;

    const paths = featurePath.split(".");
    let current: any = config.features;

    for (const path of paths) {
      current = current?.[path];
      if (!current) return null;
    }

    return current;
  };

  return {
    features: config?.features || {},
    isFeatureEnabled,
    getFeatureParams,
    getFeatureConfig,
    loading,
    error,
    // 便捷访问器
    dashboard: config?.features.dashboard,
    projects: config?.features.projects,
    issues: config?.features.issues,
    code: config?.features.code,
  };
}
```

### 使用示例

```tsx
// components/Dashboard.tsx
import React from "react";
import { useFeatures } from "../hooks/useFeatures";

export default function Dashboard() {
  const features = useFeatures();

  if (features.loading) {
    return <div>Loading...</div>;
  }

  if (!features.isFeatureEnabled("dashboard")) {
    return <div>Dashboard is not available in this version</div>;
  }

  const dashboardParams = features.getFeatureParams("dashboard");
  const widgets = dashboardParams.widgets || [];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {widgets.map((widget: string) => (
        <div key={widget} className={`widget widget-${widget}`}>
          {/* Widget content */}
        </div>
      ))}

      {features.isFeatureEnabled("projects") && (
        <div className="projects-section">
          <h2>Projects</h2>
          <p>
            Max projects: {features.getFeatureParams("projects").maxProjects}
          </p>

          {features.isFeatureEnabled("projects.pipelines") && (
            <div>
              <h3>Pipelines</h3>
              <p>
                Max pipelines:{" "}
                {features.getFeatureParams("projects.pipelines").maxPipelines}
              </p>
            </div>
          )}
        </div>
      )}

      {features.code?.enabled && (
        <div className="code-section">
          <h2>Code</h2>
          {features.code.params.repositories && <p>Repositories enabled</p>}
          {features.code.params.codeReview && <p>Code review enabled</p>}
        </div>
      )}
    </div>
  );
}
```

## 构建配置

### Vite 配置

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function getVersionType(
  version?: string
): "community" | "enterprise" | "professional" {
  const currentVersion = version || "community";

  if (currentVersion === "community") return "community";
  if (currentVersion === "enterprise") return "enterprise";

  return "professional";
}

export default defineConfig(({ mode }) => {
  const version = process.env.VERSION || "community";
  const versionType = getVersionType(version);

  return {
    plugins: [react()],
    define: {
      "process.env.VERSION": JSON.stringify(version),
      "process.env.VERSION_TYPE": JSON.stringify(versionType),
    },
    build: {
      outDir: `dist/${versionType}`,
    },
  };
});
```

### Package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "dev:community": "VERSION=community vite",
    "dev:enterprise": "VERSION=enterprise vite",
    "dev:professional": "VERSION=professional vite",

    "build": "vite build",
    "build:community": "VERSION=community vite build",
    "build:enterprise": "VERSION=enterprise vite build",
    "build:professional": "VERSION=professional vite build",

    "preview": "vite preview"
  }
}
```

## 最佳实践

### 1. 文件组织

- 保持默认文件作为基础实现
- 特定版本文件只包含差异化内容
- 使用 TypeScript 确保类型安全

### 2. 配置管理

- 配置文件使用 TypeScript 编写，享受类型检查
- 提供完整的默认配置作为回退
- 使用层次化的功能配置结构

### 3. 性能优化

- 使用配置缓存避免重复加载
- 按需加载特定版本的模块
- 构建时进行代码分割和优化

### 4. 开发体验

- 提供清晰的环境变量设置
- 使用 Hook 封装复杂的配置逻辑
- 提供类型安全的 API 接口
