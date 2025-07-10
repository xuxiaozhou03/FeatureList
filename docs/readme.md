# 版本/功能清单控制系统

一个基于 React + TypeScript + Ant Design 构建的现代化版本功能管理系统，提供可视化的版本配置管理和功能清单控制功能。

## 系统概述

该系统专为企业级应用设计，支持多版本功能管理和动态配置，可以轻松实现不同版本产品的功能差异化控制。

## 核心功能

### 🎯 版本管理

- **多版本支持**：支持社区版、企业版、专业版等多个版本
- **动态切换**：运行时支持版本动态切换
- **配置隔离**：每个版本独立的功能配置和参数设置

### 🔧 功能清单控制

- **功能开关**：通过配置控制功能的启用/禁用状态
- **权限控制**：基于版本和用户权限的功能可见性控制
- **参数化配置**：支持功能的个性化参数配置
- **嵌套功能**：支持父子功能的层级管理

### 📊 可视化管理

- **在线编辑**：提供表单模式和 JSON 模式的在线编辑
- **实时预览**：配置变更后实时预览效果
- **Schema 验证**：基于 JSON Schema 的配置验证
- **类型安全**：完整的 TypeScript 类型定义

## 版本规划

### 企业版 (Enterprise)

- 完整功能集合
- 高级安全特性
- 无限制使用
- 24/7 技术支持

### 社区版 (Community)

- 基础功能集合
- 适合个人和小团队
- 功能限制较多
- 社区支持

### 专业版 (Professional)

- 针对私有化客户定制
- 灵活的功能组合
- 可定制化配置
- 专属客户版本：
  - 专业版-客户 1
  - 专业版-客户 2

## 技术架构

### 前端技术栈

- **React 18**：现代化的用户界面框架
- **TypeScript**：类型安全的 JavaScript 超集
- **Ant Design 5.0**：企业级 UI 组件库
- **Tailwind CSS**：实用优先的 CSS 框架
- **Monaco Editor**：基于 VS Code 的在线代码编辑器
- **React Router DOM**：客户端路由管理
- **Vite**：现代化构建工具

### 核心模块

- **功能定义模块** (`/modules/define`)：功能清单的 Schema 定义
- **版本管理模块** (`/modules/versions`)：版本配置的增删改查
- **功能展示模块** (`/modules/display`)：功能状态的可视化展示
- **Schema 管理模块** (`/modules/schema`)：JSON Schema 的生成和管理
- **Hooks 模块** (`/modules/hooks`)：可复用的状态管理逻辑

## 系统实现

### 1. 功能清单定义

使用 JSON Schema 定义功能清单的数据结构，确保配置的一致性和可验证性。

#### 功能配置接口

```ts
interface FeatureConfig {
  [featureName: string]: {
    // 功能名称
    title: string;
    // 功能详细描述
    description?: string;
    // 功能个性化配置参数配置
    paramsConfig?: {
      // 配置项名称
      [paramName: string]: {
        // 配置项的类型：目前支持 字符串，数字，布尔，枚举
        type: "string" | "number" | "boolean" | "enum";
        // 配置项的标题
        title: string;
        // 功能详细描述
        description?: string;
        // 枚举选项
        enums?: { label: string; value: string | number }[];
      };
    };
    // 子项功能
    children?: FeatureConfig;
  };
}
```

#### 版本配置结构

```ts
interface VersionConfig {
  id: string; // 版本唯一标识
  version: string; // 版本号 (如: 1.0.0)
  name: string; // 版本名称 (如: community, enterprise)
  description: string; // 版本描述
  features: {
    // 功能配置对象
    [featureName: string]: {
      enabled: boolean; // 功能是否启用
      params?: any; // 功能参数配置
      children?: any; // 子功能配置
    };
  };
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}
```

### 2. 版本配置管理

提供完整的版本配置生命周期管理，包括创建、编辑、删除、导入导出等功能。

#### 主要特性

- **双模式编辑**：支持表单模式和 JSON 模式
- **实时验证**：基于 JSON Schema 的配置验证
- **批量操作**：支持批量导出和导入配置
- **版本控制**：自动记录配置的创建和修改时间

#### 配置编辑器

- **表单模式**：基于 Ant Design 的可视化表单编辑
- **JSON 模式**：基于 Monaco Editor 的代码编辑，支持语法高亮和自动完成
- **Schema 支持**：实时 JSON Schema 验证和错误提示

### 3. 功能展示系统

提供多维度的功能状态展示和实时测试功能。

#### 展示页面功能

- **版本信息展示**：当前版本的基本信息和统计数据
- **功能状态概览**：功能启用状态的可视化展示
- **详细配置查看**：每个功能的详细参数配置
- **开发者文档**：完整的 API 使用说明和示例

#### 实时测试功能

- **Hook 测试**：测试各种功能检查 Hook 的正确性
- **版本切换测试**：动态切换版本并验证功能变化
- **配置对比**：对比不同访问方式的结果一致性

### 4. Schema 管理

自动生成和管理 JSON Schema 定义，确保配置的类型安全。

#### 主要功能

- **动态 Schema 生成**：基于功能清单自动生成版本配置的 JSON Schema
- **TypeScript 定义导出**：生成对应的 TypeScript 类型定义
- **Schema 下载**：支持 Schema 文件和类型定义文件的下载

## 使用指南

### 快速开始

1. **克隆项目**

   ```bash
   git clone <repository-url>
   cd FeatureList
   ```

2. **安装依赖**

   ```bash
   pnpm install
   ```

3. **启动开发服务器**

   ```bash
   # 默认启动（企业版）
   pnpm run dev

   # 指定版本启动
   pnpm run dev:community    # 社区版
   pnpm run dev:enterprise   # 企业版
   pnpm run dev:professional # 专业版
   ```

4. **访问应用**
   - 版本管理页面：`http://localhost:5173/versions`
   - 功能展示页面：`http://localhost:5173/display`
   - Schema 管理页面：`http://localhost:5173/schema`

### 页面导航

#### 🏠 首页 (`/`)

- 系统概览和快速导航
- 版本状态摘要
- 功能统计信息

#### ⚙️ 版本管理 (`/versions`)

- **版本列表**：查看所有已配置的版本
- **版本编辑**：支持表单模式和 JSON 模式编辑
- **版本操作**：创建、删除、导入、导出版本配置
- **实时预览**：配置变更的实时预览

#### 📊 功能展示 (`/display`)

- **版本信息**：当前版本的详细信息
- **功能概览**：功能启用状态的统计和可视化
- **功能详情**：每个功能的详细配置和参数
- **开发者测试**：Hook 功能的实时测试和验证

#### 📐 Schema 管理 (`/schema`)

- **JSON Schema**：版本配置的 Schema 定义
- **TypeScript 定义**：类型安全的 TypeScript 接口
- **文件下载**：Schema 和类型定义文件的下载

## 开发者文档

### 核心 Hooks

#### useFeatures()

获取当前版本、配置和功能信息的核心 Hook。

```ts
const {
  version, // 当前版本名称
  setVersion, // 切换版本函数
  versionConfig, // 当前版本配置
  features, // 功能配置对象
  isEnterprise, // 是否为企业版
  isCommunity, // 是否为社区版
  isProfessional, // 是否为专业版
} = useFeatures();
```

#### useFeatureEnabled(path)

检查特定功能是否启用。

```ts
// 检查顶级功能
const dashboardEnabled = useFeatureEnabled("dashboard");

// 检查嵌套功能
const pipelinesEnabled = useFeatureEnabled("projects.pipelines");
```

#### useFeatureParams(path)

获取功能的参数配置。

```ts
// 获取功能参数
const dashboardParams = useFeatureParams("dashboard");
const pipelinesParams = useFeatureParams("projects.pipelines");

// 使用参数
<Dashboard layout={dashboardParams?.layout} />;
```

#### useVersions()

管理版本列表的状态。

```ts
const [versions, setVersions] = useVersions();

// 添加新版本
setVersions([...versions, newVersion]);
```

#### useFeatureSchema()

管理功能模式配置。

```ts
const [schema, setSchema] = useFeatureSchema();

// 更新模式
setSchema(JSON.stringify(newSchema, null, 2));
```

### 使用示例

#### 基础用法

```tsx
import { useFeatures, useFeatureEnabled } from "./modules/hooks";

const MyComponent = () => {
  const { version, versionConfig } = useFeatures();
  const dashboardEnabled = useFeatureEnabled("dashboard");
  const pipelinesEnabled = useFeatureEnabled("projects.pipelines");

  return (
    <div>
      <h1>
        {versionConfig.name} - {versionConfig.description}
      </h1>
      {dashboardEnabled && <Dashboard />}
      {pipelinesEnabled && <Pipelines />}
    </div>
  );
};
```

#### 条件渲染

```tsx
const ConditionalFeatures = () => {
  const { isEnterprise, isCommunity } = useFeatures();

  return (
    <div>
      {isEnterprise && <EnterpriseOnlyFeature />}
      {isCommunity && <CommunityFeature />}
    </div>
  );
};
```

#### 参数化配置

```tsx
const ConfigurableComponent = () => {
  const dashboardParams = useFeatureParams("dashboard");
  const projectsParams = useFeatureParams("projects");

  return (
    <div>
      <Dashboard
        layout={dashboardParams?.layout}
        refreshInterval={dashboardParams?.refreshInterval}
      />
      <Projects maxProjects={projectsParams?.maxProjects} />
    </div>
  );
};
```

## API 参考

### 环境变量

- `VERSION`：指定启动时的默认版本（community | enterprise | professional）
- `__VERSION__`：运行时注入的版本标识

### 配置文件

#### package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "dev:community": "VERSION=community vite",
    "dev:enterprise": "VERSION=enterprise vite",
    "dev:professional": "VERSION=professional vite",
    "build": "tsc && vite build",
    "build:community": "tsc && VERSION=community vite build",
    "build:enterprise": "tsc && VERSION=enterprise vite build",
    "build:professional": "tsc && VERSION=professional vite build"
  }
}
```

#### 版本配置示例

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
            "concurrentBuilds": 3
          }
        }
      }
    }
  }
}
```

## 最佳实践

### 1. 功能设计原则

- **最小化原则**：只在必要时添加功能开关
- **向后兼容**：新功能默认向后兼容
- **清晰命名**：使用语义化的功能名称
- **合理分层**：适当使用子功能来组织复杂功能

### 2. 配置管理

- **环境隔离**：不同环境使用独立的配置
- **版本控制**：将配置文件纳入版本控制
- **文档同步**：保持配置文档与实际配置的同步

### 3. 开发建议

- **类型安全**：充分利用 TypeScript 的类型检查
- **测试覆盖**：为功能开关编写单元测试
- **性能考虑**：避免在渲染循环中频繁调用 Hook
- **错误处理**：妥善处理配置缺失或错误的情况

### 4. 部署建议

- **配置验证**：部署前验证配置的正确性
- **灰度发布**：使用功能开关进行灰度发布
- **监控告警**：监控功能开关的使用情况
- **回滚策略**：准备快速回滚机制

## 故障排除

### 常见问题

#### 1. 版本切换不生效

**问题**：调用 `setVersion()` 后功能状态没有变化
**解决**：检查版本名称是否正确，确认版本配置是否存在

#### 2. 功能检查返回 undefined

**问题**：`useFeatureEnabled()` 返回 undefined 而不是 boolean
**解决**：检查功能路径是否正确，确认配置中是否包含该功能

#### 3. 参数获取失败

**问题**：`useFeatureParams()` 返回 null
**解决**：确认功能已启用且包含 params 配置

#### 4. Schema 验证失败

**问题**：JSON 编辑器显示 Schema 验证错误
**解决**：检查 JSON 格式是否正确，字段类型是否匹配

### 调试技巧

1. **使用开发者工具**：打开浏览器开发者工具查看 Console 输出
2. **启用测试模式**：访问 `/display` 页面使用内置的测试功能
3. **检查 localStorage**：查看浏览器 localStorage 中的配置数据
4. **版本对比**：使用版本切换功能对比不同版本的行为差异

## 项目结构

```
src/
├── modules/
│   ├── define/              # 功能定义模块
│   │   ├── constant/        # 常量和 Schema 定义
│   │   └── components/      # 预览组件
│   ├── versions/            # 版本管理模块
│   │   ├── components/      # 版本管理组件
│   │   └── styles.css       # 样式文件
│   ├── display/             # 功能展示模块
│   │   └── components/      # 展示组件
│   ├── schema/              # Schema 管理模块
│   │   ├── components/      # Schema 编辑器
│   │   └── utils/           # Schema 工具函数
│   └── hooks/               # 全局 Hooks
├── auto-generate/           # 自动生成的配置文件
├── components/              # 通用组件
└── styles/                  # 全局样式
```

## 贡献指南

### 开发流程

1. Fork 项目并克隆到本地
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交变更：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 规则
- 编写必要的单元测试
- 更新相关文档

### 提交规范

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建或工具变动

## 许可证

本项目基于 MIT 许可证开源，详情请参阅 LICENSE 文件。
