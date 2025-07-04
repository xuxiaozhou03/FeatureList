# 版本配置系统

## 概述

这个版本配置系统允许您通过环境变量来控制应用的功能配置，支持不同版本（如企业版、社区版）的功能差异化管理。

## 特性

- 🎯 **环境变量控制**: 通过 `__VERSION__` 环境变量进行版本切换
- 🔧 **功能开关**: 灵活控制功能的启用/禁用状态
- ⚙️ **参数配置**: 支持功能的参数化配置
- 🪝 **React Hooks**: 提供便捷的 React Hooks API
- 📝 **嵌套配置**: 支持多层级的功能配置结构

## 使用方法

### 1. 环境变量设置

```bash
# 开发环境
VERSION=enterprise npm run dev

# 构建时
VERSION=community npm run build

# 生产环境
export VERSION=enterprise
```

### 2. 可用的 Hooks

#### `useCurrentVersion()`

获取当前激活的版本名称

```tsx
const version = useCurrentVersion();
// 返回: 'enterprise' | 'community'
```

#### `useVersionConfig()`

获取完整的版本配置对象

```tsx
const config = useVersionConfig();
// 返回: { id, name, description, version, features, ... }
```

#### `useFeatureEnabled(featurePath)`

检查指定功能是否启用

```tsx
const dashboardEnabled = useFeatureEnabled("dashboard");
const pipelinesEnabled = useFeatureEnabled("projects.pipelines");
```

#### `useFeatureParams(featurePath)`

获取功能的参数配置

```tsx
const dashboardParams = useFeatureParams("dashboard");
// 返回: { layout: 'grid', refreshInterval: 30 }
```

#### `useVersionFeatures()`

获取所有功能配置

```tsx
const features = useVersionFeatures();
```

### 3. 功能路径说明

支持使用点分隔符来访问嵌套功能：

```tsx
// 访问顶级功能
useFeatureEnabled("dashboard");

// 访问嵌套功能
useFeatureEnabled("projects.pipelines");
useFeatureEnabled("projects.pipelines.advanced");
```

### 4. 实际使用示例

```tsx
import {
  useCurrentVersion,
  useFeatureEnabled,
  useFeatureParams,
} from "./hooks";

const MyComponent = () => {
  const version = useCurrentVersion();
  const isEnterprise = version === "enterprise";

  const dashboardEnabled = useFeatureEnabled("dashboard");
  const dashboardParams = useFeatureParams("dashboard");

  const pipelinesEnabled = useFeatureEnabled("projects.pipelines");
  const pipelinesParams = useFeatureParams("projects.pipelines");

  return (
    <div>
      <h1>当前版本: {version}</h1>

      {/* 基于版本的条件渲染 */}
      {isEnterprise && <EnterpriseFeatures />}

      {/* 基于功能状态的条件渲染 */}
      {dashboardEnabled && (
        <Dashboard
          layout={dashboardParams.layout}
          refreshInterval={dashboardParams.refreshInterval}
        />
      )}

      {pipelinesEnabled && (
        <PipelinesFeature
          maxPipelines={pipelinesParams.maxPipelines}
          supportedRunners={pipelinesParams.supportedRunners}
        />
      )}
    </div>
  );
};
```

## 版本配置文件结构

### 企业版 (enterprise.json)

```json
{
  "id": "1751617656993",
  "version": "1.0.1",
  "name": "enterprise",
  "description": "企业版",
  "features": {
    "dashboard": {
      "enabled": true,
      "params": {
        "layout": "grid",
        "refreshInterval": 30
      }
    },
    "projects": {
      "enabled": true,
      "params": {
        "maxProjects": 100,
        "visibility": ["public", "private"],
        "templates": false
      }
    }
  }
}
```

### 社区版 (community.json)

```json
{
  "id": "1751617587573",
  "version": "1.0.0",
  "name": "community",
  "description": "社区版",
  "features": {
    "dashboard": {
      "enabled": true,
      "params": {
        "layout": "grid",
        "refreshInterval": 30
      }
    },
    "projects": {
      "enabled": true,
      "params": {
        "maxProjects": 100,
        "visibility": ["public", "private"],
        "templates": true
      },
      "children": {
        "pipelines": {
          "enabled": false,
          "params": {
            "maxPipelines": 10,
            "concurrentBuilds": 3,
            "buildTimeout": 3600,
            "supportedRunners": ["docker"]
          }
        }
      }
    }
  }
}
```

## 最佳实践

1. **条件渲染**: 始终使用 `useFeatureEnabled` 来进行条件渲染，避免渲染不可用的功能
2. **参数配置**: 使用 `useFeatureParams` 来获取功能配置，确保配置的灵活性
3. **嵌套功能**: 合理使用嵌套结构来组织复杂的功能层次
4. **版本测试**: 在开发环境中测试不同版本的功能差异
5. **错误处理**: 对不存在的功能路径进行适当的错误处理

## 项目结构

```
src/
├── modules/
│   ├── hooks/
│   │   └── index.ts          # 版本配置相关的 React Hooks
│   ├── display/
│   │   ├── index.tsx         # 版本配置展示页面
│   │   └── components/       # 展示组件
│   └── type/
│       └── index.ts          # TypeScript 类型定义
└── public/
    ├── enterprise.json       # 企业版配置
    └── community.json        # 社区版配置
```

## 开发调试

访问 `/display` 页面可以查看当前版本的配置详情，包括：

- 当前激活的版本信息
- 功能状态概览
- 详细的功能配置
- 开发者文档和示例代码

## 扩展新版本

1. 在 `public/` 目录下创建新的版本配置文件
2. 更新 `hooks/index.ts` 中的版本列表
3. 更新 `vite.config.ts` 中的有效版本列表
4. 测试新版本的功能配置

## 技术实现

- **构建时注入**: 通过 Vite 的 `define` 配置将 `__VERSION__` 环境变量注入到客户端代码中
- **状态管理**: 使用 `ahooks` 的 `useLocalStorageState` 进行本地状态管理
- **类型安全**: 提供完整的 TypeScript 类型定义
- **响应式**: 基于 React Hooks 的响应式状态管理
