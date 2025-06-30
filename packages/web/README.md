# FeatureList - 基于功能清单的多版本部署方案

## 项目概述

基于功能清单，实现一套代码，可以部署不同版本。通过配置化的方式，根据不同的功能清单动态启用或禁用功能模块，从而实现同一套代码库支持多个产品版本的部署。

## 前端技术方案

### 技术栈

- **框架**: React 19.1.0
- **语言**: TypeScript 5.8.3
- **构建工具**: Vite 7.0.0
- **代码规范**: ESLint
- **包管理**: npm/yarn/pnpm

### 核心架构

#### 1. 功能清单配置

```typescript
// types/feature.ts
export interface FeatureConfig {
  id: string;
  name: string;
  enabled: boolean;
  version?: string;
  dependencies?: string[];
  routes?: string[];
  components?: string[];
}

export interface VersionConfig {
  version: string;
  name: string;
  features: FeatureConfig[];
}
```

#### 2. 功能开关系统

基于功能清单实现的核心系统，支持：

- **静态配置**: 构建时根据版本配置启用/禁用功能
- **动态开关**: 运行时根据用户权限或远程配置调整功能
- **渐进式发布**: 支持灰度发布和 A/B 测试

```typescript
// hooks/useFeature.ts
export const useFeature = (featureId: string): boolean => {
  const featureConfig = useContext(FeatureContext);
  return featureConfig.isEnabled(featureId);
};

// components/FeatureGate.tsx
export const FeatureGate: React.FC<{
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ feature, children, fallback = null }) => {
  const isEnabled = useFeature(feature);
  return isEnabled ? <>{children}</> : <>{fallback}</>;
};
```

#### 3. 模块化架构

- **功能模块**: 每个功能作为独立模块开发
- **组件库**: 共享组件支持功能开关
- **路由管理**: 动态路由注册和权限控制
- **状态管理**: 模块化状态管理

#### 4. 构建配置

基于 Vite 的多版本构建系统：

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const versionConfig = loadVersionConfig(mode);

  return {
    define: {
      __FEATURE_CONFIG__: JSON.stringify(versionConfig.features),
      __VERSION__: JSON.stringify(versionConfig.version),
    },
    build: {
      rollupOptions: {
        // 根据功能清单进行代码分割
        manualChunks: generateChunks(versionConfig.features),
      },
    },
  };
});
```

### 实现方案

#### 1. 目录结构

```
src/
├── features/           # 功能模块
│   ├── auth/          # 认证功能
│   ├── dashboard/     # 仪表盘功能
│   ├── reports/       # 报表功能
│   └── ...
├── shared/            # 共享模块
│   ├── components/    # 通用组件
│   ├── hooks/         # 通用钩子
│   ├── utils/         # 工具函数
│   └── types/         # 类型定义
├── config/            # 配置文件
│   ├── features/      # 功能配置
│   └── versions/      # 版本配置
└── App.tsx           # 应用入口
```

#### 2. 功能模块开发

每个功能模块独立开发，包含：

- 组件定义
- 路由配置
- 状态管理
- API 接口
- 测试用例

```typescript
// features/auth/index.ts
export const AuthFeature: FeatureModule = {
  id: "auth",
  name: "用户认证",
  routes: [
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
  ],
  components: {
    LoginForm,
    UserProfile,
  },
  initialize: (app) => {
    // 功能初始化逻辑
  },
};
```

#### 3. 版本配置管理

```json
// config/versions/enterprise.json
{
  "version": "enterprise-v1.0",
  "name": "企业版",
  "features": [
    {
      "id": "auth",
      "enabled": true,
      "config": {
        "sso": true,
        "ldap": true
      }
    },
    {
      "id": "advanced-reports",
      "enabled": true
    },
    {
      "id": "api-management",
      "enabled": true
    }
  ]
}
```

```json
// config/versions/basic.json
{
  "version": "basic-v1.0",
  "name": "基础版",
  "features": [
    {
      "id": "auth",
      "enabled": true,
      "config": {
        "sso": false,
        "ldap": false
      }
    },
    {
      "id": "basic-reports",
      "enabled": true
    }
  ]
}
```

### 部署方案

#### 1. 多版本构建

```bash
# 构建企业版
npm run build:enterprise

# 构建基础版
npm run build:basic

# 构建自定义版本
npm run build:custom -- --config=custom-client.json
```

#### 2. 环境配置

```json
// package.json
{
  "scripts": {
    "dev": "vite --mode development",
    "dev:enterprise": "vite --mode enterprise",
    "dev:basic": "vite --mode basic",
    "build": "tsc -b && vite build",
    "build:enterprise": "tsc -b && vite build --mode enterprise",
    "build:basic": "tsc -b && vite build --mode basic",
    "build:custom": "tsc -b && vite build --mode custom"
  }
}
```

#### 3. CI/CD 集成

支持自动化构建和部署不同版本，可以根据分支或标签自动选择对应的功能配置。

### 优势特点

1. **代码复用**: 一套代码支持多个版本
2. **灵活配置**: 通过配置文件控制功能启用
3. **按需加载**: 只打包启用的功能模块
4. **易于维护**: 功能模块化，便于开发和测试
5. **快速发布**: 支持快速生成不同版本的产品

### 开发指南

#### 新增功能模块

1. 在 `src/features/` 下创建功能目录
2. 实现功能模块接口
3. 在版本配置中添加功能定义
4. 编写测试用例

#### 版本管理

1. 在 `config/versions/` 下创建版本配置文件
2. 定义该版本包含的功能清单
3. 配置功能参数和权限
4. 测试版本构建和部署

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 默认版本开发
npm run dev

# 企业版开发
npm run dev:enterprise

# 基础版开发
npm run dev:basic
```

### 构建部署

```bash
# 构建企业版
npm run build:enterprise

# 构建基础版
npm run build:basic
```

## 许可证

MIT License

### 技术实现细节

#### 1. 功能开关核心实现

##### FeatureContext 上下文管理

```typescript
// contexts/FeatureContext.tsx
import React, { createContext, useContext, ReactNode } from "react";

interface FeatureContextType {
  features: Record<string, FeatureConfig>;
  isEnabled: (featureId: string) => boolean;
  getFeatureConfig: (featureId: string) => FeatureConfig | undefined;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const FeatureProvider: React.FC<{
  config: VersionConfig;
  children: ReactNode;
}> = ({ config, children }) => {
  const features = config.features.reduce((acc, feature) => {
    acc[feature.id] = feature;
    return acc;
  }, {} as Record<string, FeatureConfig>);

  const isEnabled = (featureId: string): boolean => {
    const feature = features[featureId];
    return feature?.enabled ?? false;
  };

  const getFeatureConfig = (featureId: string): FeatureConfig | undefined => {
    return features[featureId];
  };

  return (
    <FeatureContext.Provider value={{ features, isEnabled, getFeatureConfig }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatureContext = (): FeatureContextType => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatureContext must be used within a FeatureProvider");
  }
  return context;
};
```

##### 功能开关 Hook

```typescript
// hooks/useFeature.ts
import { useFeatureContext } from "../contexts/FeatureContext";

export const useFeature = (featureId: string): boolean => {
  const { isEnabled } = useFeatureContext();
  return isEnabled(featureId);
};

export const useFeatureConfig = <T = any>(featureId: string): T | undefined => {
  const { getFeatureConfig } = useFeatureContext();
  const feature = getFeatureConfig(featureId);
  return feature?.config as T;
};

// 条件性Hook - 只有功能启用时才执行
export const useConditionalFeature = <T>(
  featureId: string,
  hook: () => T,
  fallback?: T
): T | undefined => {
  const isEnabled = useFeature(featureId);
  if (isEnabled) {
    return hook();
  }
  return fallback;
};
```

#### 2. 动态路由系统

```typescript
// router/FeatureRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useFeatureContext } from "../contexts/FeatureContext";

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  feature?: string;
  exact?: boolean;
  children?: RouteConfig[];
}

const FeatureRoute: React.FC<{
  route: RouteConfig;
}> = ({ route }) => {
  const { isEnabled } = useFeatureContext();

  // 如果指定了功能开关且功能未启用，返回404或重定向
  if (route.feature && !isEnabled(route.feature)) {
    return <Route path={route.path} element={<Navigate to="/404" replace />} />;
  }

  return (
    <Route path={route.path} element={<route.component />}>
      {route.children?.map((childRoute, index) => (
        <FeatureRoute key={index} route={childRoute} />
      ))}
    </Route>
  );
};

export const FeatureRouter: React.FC<{
  routes: RouteConfig[];
}> = ({ routes }) => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <FeatureRoute key={index} route={route} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
```

#### 3. 组件级功能控制

```typescript
// components/FeatureGate.tsx
import React, { ReactNode } from "react";
import { useFeature } from "../hooks/useFeature";

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  mode?: "show" | "hide" | "redirect";
  redirectTo?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback = null,
  mode = "show",
}) => {
  const isEnabled = useFeature(feature);

  if (mode === "hide") {
    return isEnabled ? null : <>{children}</>;
  }

  return isEnabled ? <>{children}</> : <>{fallback}</>;
};

// HOC 方式的功能控制
export const withFeature = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureId: string,
  fallback?: React.ComponentType<P>
) => {
  return (props: P) => {
    const isEnabled = useFeature(featureId);

    if (!isEnabled && fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent {...props} />;
    }

    return isEnabled ? <WrappedComponent {...props} /> : null;
  };
};
```

#### 4. 构建时功能剔除

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

interface VersionConfig {
  version: string;
  name: string;
  features: Array<{
    id: string;
    enabled: boolean;
    config?: any;
  }>;
}

const loadVersionConfig = (mode: string): VersionConfig => {
  const configPath = resolve(__dirname, `config/versions/${mode}.json`);
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  // 默认配置
  return {
    version: "default",
    name: "默认版本",
    features: [],
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const versionConfig = loadVersionConfig(mode);

  // 启用的功能列表
  const enabledFeatures = versionConfig.features
    .filter((f) => f.enabled)
    .map((f) => f.id);

  return {
    plugins: [react()],
    define: {
      __FEATURE_CONFIG__: JSON.stringify(versionConfig.features),
      __VERSION__: JSON.stringify(versionConfig.version),
      __ENABLED_FEATURES__: JSON.stringify(enabledFeatures),
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@features": resolve(__dirname, "src/features"),
        "@shared": resolve(__dirname, "src/shared"),
        "@config": resolve(__dirname, "config"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 根据功能模块进行代码分割
            if (id.includes("/features/")) {
              const featureName = id.split("/features/")[1].split("/")[0];
              if (enabledFeatures.includes(featureName)) {
                return `feature-${featureName}`;
              }
              // 未启用的功能不打包
              return undefined;
            }

            // node_modules 单独打包
            if (id.includes("node_modules")) {
              return "vendor";
            }

            return "main";
          },
        },
      },
      // 移除未使用的代码
      minify: "terser",
      terserOptions: {
        compress: {
          dead_code: true,
          drop_debugger: true,
          drop_console: mode === "production",
        },
      },
    },
  };
});
```

#### 5. 类型安全的功能配置

```typescript
// types/features.ts
export interface BaseFeatureConfig {
  id: string;
  enabled: boolean;
  version?: string;
  dependencies?: string[];
}

// 认证功能配置
export interface AuthFeatureConfig extends BaseFeatureConfig {
  id: "auth";
  config?: {
    sso?: boolean;
    ldap?: boolean;
    oauth?: {
      google?: boolean;
      github?: boolean;
    };
  };
}

// 报表功能配置
export interface ReportsFeatureConfig extends BaseFeatureConfig {
  id: "reports";
  config?: {
    export?: boolean;
    schedule?: boolean;
    customFields?: boolean;
  };
}

// 联合类型，确保类型安全
export type FeatureConfig = AuthFeatureConfig | ReportsFeatureConfig;

// 功能ID类型
export type FeatureId = FeatureConfig["id"];

// 类型安全的useFeature Hook
export const useTypedFeature = <T extends FeatureConfig>(
  featureId: T["id"]
): boolean => {
  return useFeature(featureId);
};
```

#### 6. 运行时配置加载

```typescript
// services/ConfigService.ts
class ConfigService {
  private static instance: ConfigService;
  private config: VersionConfig | null = null;

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async loadRemoteConfig(version?: string): Promise<VersionConfig> {
    try {
      // 从远程API加载配置
      const response = await fetch(`/api/config/${version || "default"}`);
      const config = await response.json();
      this.config = config;
      return config;
    } catch (error) {
      console.warn("Failed to load remote config, using default:", error);
      return this.getDefaultConfig();
    }
  }

  getConfig(): VersionConfig {
    if (!this.config) {
      // 使用构建时注入的配置作为fallback
      this.config = {
        version: __VERSION__,
        name: "Default",
        features: __FEATURE_CONFIG__,
      };
    }
    return this.config;
  }

  private getDefaultConfig(): VersionConfig {
    return {
      version: "default",
      name: "默认版本",
      features: [],
    };
  }

  isFeatureEnabled(featureId: string): boolean {
    const config = this.getConfig();
    const feature = config.features.find((f) => f.id === featureId);
    return feature?.enabled ?? false;
  }
}

export default ConfigService;
```

### 性能优化

#### 1. 代码分割与懒加载

```typescript
// features/FeatureLoader.tsx
import React, { lazy, Suspense } from "react";
import { useFeature } from "../hooks/useFeature";

const createFeatureLoader = (featureId: string, loader: () => Promise<any>) => {
  const LazyComponent = lazy(loader);

  return (props: any) => {
    const isEnabled = useFeature(featureId);

    if (!isEnabled) {
      return null;
    }

    return (
      <Suspense fallback={<div>Loading feature...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// 使用示例
export const AuthModule = createFeatureLoader(
  "auth",
  () => import("./auth/AuthModule")
);

export const ReportsModule = createFeatureLoader(
  "reports",
  () => import("./reports/ReportsModule")
);
```

#### 2. Bundle 分析与优化

```typescript
// scripts/analyze-bundle.ts
import { execSync } from "child_process";
import fs from "fs";

const analyzeBuild = (version: string) => {
  console.log(`Analyzing bundle for version: ${version}`);

  // 构建并分析
  execSync(`npm run build:${version}`, { stdio: "inherit" });

  // 生成分析报告
  execSync(`npx vite-bundle-analyzer dist`, { stdio: "inherit" });

  // 计算包大小
  const stats = fs.statSync(`dist/assets`);
  console.log(`Bundle size for ${version}: ${stats.size} bytes`);
};

// 分析所有版本
["basic", "enterprise", "custom"].forEach(analyzeBuild);
```

### 测试策略

#### 1. 功能开关测试

```typescript
// tests/FeatureGate.test.tsx
import { render, screen } from "@testing-library/react";
import { FeatureGate } from "../components/FeatureGate";
import { FeatureProvider } from "../contexts/FeatureContext";

const createTestWrapper = (features: any[]) => {
  const config = { version: "test", name: "Test", features };
  return ({ children }: { children: React.ReactNode }) => (
    <FeatureProvider config={config}>{children}</FeatureProvider>
  );
};

describe("FeatureGate", () => {
  it("should render children when feature is enabled", () => {
    const Wrapper = createTestWrapper([{ id: "test-feature", enabled: true }]);

    render(
      <FeatureGate feature="test-feature">
        <div>Feature Content</div>
      </FeatureGate>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText("Feature Content")).toBeInTheDocument();
  });

  it("should render fallback when feature is disabled", () => {
    const Wrapper = createTestWrapper([{ id: "test-feature", enabled: false }]);

    render(
      <FeatureGate
        feature="test-feature"
        fallback={<div>Fallback Content</div>}
      >
        <div>Feature Content</div>
      </FeatureGate>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText("Fallback Content")).toBeInTheDocument();
    expect(screen.queryByText("Feature Content")).not.toBeInTheDocument();
  });
});
```

#### 2. E2E 测试不同版本

```typescript
// e2e/version-tests.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Version Tests", () => {
  test("Enterprise version should have all features", async ({ page }) => {
    await page.goto("http://localhost:3000?version=enterprise");

    // 验证企业版功能
    await expect(
      page.locator('[data-testid="advanced-reports"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="sso-login"]')).toBeVisible();
    await expect(page.locator('[data-testid="api-management"]')).toBeVisible();
  });

  test("Basic version should have limited features", async ({ page }) => {
    await page.goto("http://localhost:3000?version=basic");

    // 验证基础版功能
    await expect(page.locator('[data-testid="basic-reports"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="advanced-reports"]')
    ).not.toBeVisible();
    await expect(page.locator('[data-testid="sso-login"]')).not.toBeVisible();
  });
});
```
