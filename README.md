# Feature List Monorepo

这是一个基于 npm workspaces 的 monorepo 项目，用于管理功能特性的系统。

## 项目结构

```
feature-list-monorepo/
├── packages/
│   ├── shared/          # 共享组件和工具库
│   │   ├── components/  # 共享React组件
│   │   ├── contexts/    # React Context
│   │   ├── hooks/       # 自定义Hooks
│   │   ├── services/    # 服务层
│   │   ├── types/       # TypeScript类型定义
│   │   └── index.ts     # 导出文件
│   ├── web/             # Web应用
│   │   ├── src/         # 源代码
│   │   └── public/      # 静态资源
│   └── versions/        # 版本配置文件
├── package.json         # 根package.json（workspace配置）
└── tsconfig.json        # 根TypeScript配置
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动Web应用开发模式
npm run dev

# 启动企业版开发模式
npm run dev:enterprise

# 启动基础版开发模式
npm run dev:basic
```

### 构建

```bash
# 构建所有包
npm run build

# 构建Web应用
npm run build:web

# 构建企业版Web应用
npm run build:web:enterprise

# 构建基础版Web应用
npm run build:web:basic
```

### 开发工作流

1. **Shared 包开发**：在 `packages/shared` 中开发共享组件和工具
2. **Web 应用开发**：在 `packages/web` 中开发具体的 Web 应用
3. **版本配置**：在 `packages/versions` 中配置不同的功能版本

## 包说明

### @feature-list/shared

共享组件库，包含：

- 功能特性管理组件
- React Hooks
- TypeScript 类型定义
- 服务层抽象

### @feature-list/web

Web 应用，使用共享组件库构建的 React 应用。

## 脚本命令

| 命令                  | 描述                    |
| --------------------- | ----------------------- |
| `npm run dev`         | 启动 Web 应用开发服务器 |
| `npm run build`       | 构建所有包              |
| `npm run lint`        | 代码检查                |
| `npm run clean`       | 清理所有构建产物和依赖  |
| `npm run install:all` | 安装所有依赖            |

## 技术栈

- **构建工具**: Vite
- **包管理**: npm workspaces
- **前端框架**: React 19
- **语言**: TypeScript
- **路由**: React Router
- **代码检查**: ESLint

## 开发注意事项

1. 使用 `workspace:*` 引用本地包
2. 共享组件应该在 `packages/shared` 中开发
3. 类型定义统一在 `packages/shared/types` 中管理
4. 新功能特性应该在 `packages/web/src/features` 中组织
