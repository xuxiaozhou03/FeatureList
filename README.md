# 版本-功能清单

本演示展示了如何基于功能清单实现一套代码支持多个版本部署的完整方案。

## 项目架构

采用 Monorepo 架构，包含一个通用前端项目和一个配置管理项目，通过动态配置实现多版本功能。

### 技术栈

- **前端**: React + TypeScript + Vite
- **包管理**: pnpm (支持 workspace)
- **构建工具**: Vite
- **版本管理**: 基于动态配置的版本控制
- **配置管理**: 在线配置生成器

## 项目结构

```
FeatureList/
├── packages/
│   ├── shared/              # 共享组件和工具
│   │   ├── src/
│   │   │   ├── components/  # 通用组件
│   │   │   ├── utils/       # 工具函数
│   │   │   ├── types/       # 类型定义
│   │   │   └── configs/     # 版本配置文件
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── core/                # 核心功能包
│   │   ├── src/
│   │   │   ├── features/    # 功能模块
│   │   │   ├── services/    # 服务层
│   │   │   └── store/       # 状态管理
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── app/                 # 通用前端应用
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── hooks/       # 自定义钩子
│   │   │   └── components/  # 应用组件
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── index.html
│   └── config-manager/      # 配置管理前端
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── components/  # 配置界面组件
│       │   └── services/    # 配置服务
│       ├── package.json
│       ├── vite.config.ts
│       └── index.html
├── configs/                 # 版本配置文件目录
│   ├── basic.json
│   ├── pro.json
│   └── enterprise.json
├── package.json             # 根目录配置
├── pnpm-workspace.yaml      # pnpm 工作空间配置
├── tsconfig.json            # 根 TypeScript 配置
└── README.md

```

## 功能清单配置

### 动态配置架构

系统采用动态配置方式，通过 JSON 配置文件定义不同版本的功能特性：

```typescript
// 配置文件结构示例
interface VersionConfig {
  version: string; // 版本标识
  name: string; // 版本名称
  description: string; // 版本描述
  theme: {
    // 主题配置
    primaryColor: string;
    backgroundColor: string;
  };
  features: Record<
    string,
    {
      name: string; // 功能名称
      enabled: boolean; // 是否启用
      version: string; // 功能版本
      description: string; // 功能描述
      icon: string; // 功能图标
    }
  >;
}
```

### 版本配置示例

**基础版本** (`configs/basic.json`):

```json
{
  "version": "basic",
  "name": "基础版本",
  "theme": {
    "primaryColor": "#007acc",
    "backgroundColor": "#ffffff"
  },
  "features": {
    "user-management": { "enabled": true },
    "basic-dashboard": { "enabled": true },
    "file-upload": { "enabled": true },
    "advanced-dashboard": { "enabled": false }
  }
}
```

**专业版本** (`configs/pro.json`):

```json
{
  "version": "pro",
  "name": "专业版本",
  "theme": {
    "primaryColor": "#28a745",
    "backgroundColor": "#f8fff8"
  },
  "features": {
    "user-management": { "enabled": true },
    "basic-dashboard": { "enabled": true },
    "advanced-dashboard": { "enabled": true },
    "batch-operations": { "enabled": true },
    "data-export": { "enabled": true }
  }
}
```

## 开发流程

### 1. 环境准备

```bash
# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
```

### 2. 开发命令

```bash
# 启动通用前端应用 (默认基础版本)
pnpm dev:app

# 启动配置管理器
pnpm dev:config

# 启动指定版本
pnpm dev:basic      # 基础版本
pnpm dev:pro        # 专业版本
pnpm dev:enterprise # 企业版本

# 构建应用
pnpm build:all      # 构建所有项目
pnpm build:app      # 构建通用应用
pnpm build:config   # 构建配置管理器
```

### 3. 版本切换方式

#### 方式一：URL 参数

```
http://localhost:3000?version=basic
http://localhost:3000?version=pro
http://localhost:3000?version=enterprise
```

#### 方式二：环境变量

```bash
VITE_VERSION=pro pnpm dev:app
```

#### 方式三：界面切换

在应用右上角使用版本选择器进行实时切换

### 4. 配置管理

1. 访问配置管理器: http://localhost:3001
2. 选择要编辑的版本
3. 调整功能开关和主题设置
4. 预览效果或导出配置文件
5. 将配置文件放置到 `configs/` 目录

## 部署策略

### 1. 单应用多版本部署

通用应用支持通过配置实现多版本部署：

```bash
# 构建通用应用
pnpm build:app

# 部署到不同环境
# 基础版本
VITE_VERSION=basic pnpm build:app
# 部署到 basic.example.com

# 专业版本
VITE_VERSION=pro pnpm build:app
# 部署到 pro.example.com

# 企业版本
VITE_VERSION=enterprise pnpm build:app
# 部署到 enterprise.example.com
```

### 2. 配置文件管理

```bash
# 配置文件目录结构
configs/
├── basic.json          # 基础版本配置
├── pro.json           # 专业版本配置
└── enterprise.json    # 企业版本配置

# 部署时确保配置文件可访问
/public/configs/basic.json
/public/configs/pro.json
/public/configs/enterprise.json
```

### 3. 环境变量配置

```bash
# 基础版本环境变量
VITE_VERSION=basic
VITE_API_BASE_URL=https://api-basic.example.com

# 专业版本环境变量
VITE_VERSION=pro
VITE_API_BASE_URL=https://api-pro.example.com

# 企业版本环境变量
VITE_VERSION=enterprise
VITE_API_BASE_URL=https://api-enterprise.example.com
```

## 快速开始

### 1. 安装依赖

```bash
# 确保已安装 pnpm
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 2. 启动开发服务器

```bash
# 方式一：使用演示脚本（推荐）
pnpm demo
# 或
./demo.sh

# 方式二：手动启动
# 启动通用前端应用
pnpm dev:app

# 启动配置管理器
pnpm dev:config

# 方式三：同时启动两个应用
pnpm start:all
```

### 3. 访问应用

- **通用应用（主应用）**:

  - 基础版本: http://localhost:3000?version=basic
  - 专业版本: http://localhost:3000?version=pro
  - 企业版本: http://localhost:3000?version=enterprise
  - 默认版本: http://localhost:3000 (基础版本)

- **配置管理器**: http://localhost:3001

### 4. 构建应用

```bash
# 构建所有项目
pnpm build:all

# 构建单个项目
pnpm build:app      # 构建通用应用
pnpm build:config   # 构建配置管理器
```

## ✅ 项目状态 (当前)

**已完成功能:**

- ✅ 重构为单一通用前端 (app) + 配置管理器 (config-manager) 架构
- ✅ 动态配置系统，支持 JSON 配置驱动的功能切换
- ✅ 三个版本配置文件：basic.json, pro.json, enterprise.json
- ✅ 通用前端应用，支持 URL 参数版本切换
- ✅ 配置管理器，支持在线编辑、预览、导出配置
- ✅ 版本切换器界面
- ✅ 主题系统和功能演示区域
- ✅ 开发和构建脚本
- ✅ 项目演示脚本和配置同步工具

**当前可用功能:**

- 🌐 **主应用**: http://localhost:3000 (支持 ?version=basic|pro|enterprise)
- ⚙️ **配置管理器**: http://localhost:3001
- 🚀 **快速演示**: `pnpm demo` 或 `./demo.sh`
- 🔄 **配置同步**: `pnpm sync:configs` 或 `./sync-configs.sh`

## 优势

1. **统一代码库**: 单一前端应用通过配置实现多版本功能，最大化代码复用
2. **动态配置**: 基于 JSON 配置的功能切换，无需重新编译
3. **灵活部署**: 同一套代码可部署为不同版本，支持环境变量和 URL 参数切换
4. **在线管理**: 配置管理器支持在线编辑、预览和导出配置
5. **开发效率**: 统一的开发环境，一次开发多版本受益
6. **维护简便**: 单一代码库，版本功能通过配置控制
7. **主题系统**: 支持不同版本的主题定制
8. **实时切换**: 支持运行时版本切换，便于演示和测试

## 注意事项

1. 共享代码变更时需要考虑对所有版本的影响
2. 功能开关应该有明确的命名规范
3. 版本间的依赖关系需要仔细管理
4. 构建和部署流程需要自动化处理
