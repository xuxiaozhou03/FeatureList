# @feature-list/versions

[![npm version](https://badge.fury.io/js/%40feature-list%2Fversions.svg)](https://badge.fury.io/js/%40feature-list%2Fversions)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

版本配置管理包，用于定义和管理不同版本的功能配置。

## 📋 概述

此包负责管理系统的版本配置，包括不同版本的功能启用状态和配置参数。支持灵活的功能开关和版本管理机制。

## 🚀 主要功能

- **版本配置管理**: 配置完整的功能清单和版本信息
- **功能开关**: 为不同版本启用或禁用特定功能
- **配置参数**: 为每个功能提供详细的配置选项
- **类型安全**: 提供完整的 TypeScript 类型定义
- **多格式导出**: 支持 JSON、YAML 等多种格式
- **版本比较**: 支持版本间的差异比较和报告生成

## 📦 安装

```bash
npm install @feature-list/versions
```

## 📁 项目结构

```
packages/versions/
├── src/
│   ├── types/
│   │   └── feature.ts      # 功能配置类型定义
│   ├── configs/
│   │   └── index.ts        # 配置加载器
│   ├── utils/
│   │   ├── VersionManager.ts    # 版本管理工具
│   │   └── VersionComparator.ts # 版本比较工具
│   └── index.ts            # 主入口文件
├── configs/
│   ├── basic.json          # 基础版配置
│   └── enterprise.json     # 企业版配置
├── basic/
│   └── v0.1.ts            # 基础版本定义
├── enterprise/
│   └── v0.1.ts            # 企业版本定义
├── examples/
│   └── usage.ts           # 使用示例
└── dist/                  # 构建输出目录
```

## 🔧 支持的功能模块

### 认证功能 (auth)

- **SSO**: 单点登录
- **LDAP**: LDAP 集成
- **OAuth**: 第三方登录（Google、GitHub）

### 仪表盘功能 (dashboard)

- **小部件**: 图表、表格、KPI、日历
- **自定义**: 支持用户自定义布局

### 报表功能 (reports)

- **导出**: 支持数据导出
- **定时任务**: 定时生成报表
- **自定义字段**: 支持自定义报表字段

### 高级报表功能 (advanced-reports)

- **分析**: 高级数据分析
- **图表**: 多种图表类型
- **实时数据**: 实时数据展示

### API 管理功能 (api-management)

- **文档**: API 文档管理
- **监控**: API 性能监控
- **限流**: API 访问限制

## 📊 版本配置示例

### 基础版 (basic.json)

```json
{
  "version": "basic-v1.0",
  "name": "基础版",
  "features": [
    {
      "id": "auth",
      "enabled": true,
      "config": {
        "sso": false,
        "ldap": false,
        "oauth": {
          "google": false,
          "github": false
        }
      }
    }
  ]
}
```

### 企业版 (enterprise.json)

```json
{
  "version": "enterprise-v1.0",
  "name": "企业版",
  "features": [
    {
      "id": "auth",
      "enabled": true,
      "config": {
        "sso": true,
        "ldap": true,
        "oauth": {
          "google": true,
          "github": true
        }
      }
    }
  ]
}
```

## 🛠️ API 文档

### 基本使用

```typescript
import {
  VersionManager,
  VersionComparator,
  getVersionConfig,
  getAllVersions,
  type VersionConfig,
} from "@feature-list/versions";

// 获取所有可用版本
const versions = getAllVersions();
console.log(versions); // ['basic', 'enterprise']

// 获取特定版本配置
const basicConfig = getVersionConfig("basic");
```

### VersionManager 类

```typescript
// 创建版本管理器
const manager = new VersionManager(basicConfig);

// 获取版本信息
console.log(manager.getVersion()); // "basic-v1.0"
console.log(manager.getName()); // "基础版"

// 检查功能状态
console.log(manager.isFeatureEnabled("auth")); // true
console.log(manager.isFeatureEnabled("advanced-reports")); // false

// 获取功能配置
const authConfig = manager.getFeatureConfig("auth");
console.log(authConfig); // { sso: false, ldap: false, ... }

// 获取特定功能选项
const ssoEnabled = manager.getFeatureOption("auth", "sso");
console.log(ssoEnabled); // false

// 导出配置
const jsonConfig = manager.toJSON();
const yamlConfig = manager.toYAML();
```

### VersionComparator 类

```typescript
// 比较两个版本
const diff = VersionComparator.compare(basicConfig, enterpriseConfig);
console.log(diff);
// {
//   added: [...],
//   removed: [...],
//   modified: [...]
// }

// 生成差异报告
const report = VersionComparator.generateReport(diff);
console.log(report);
```

### TypeScript 类型

```typescript
import type {
  VersionConfig,
  FeatureConfig,
  FeatureId,
  AuthFeatureConfig,
  DashboardFeatureConfig,
  VersionDiff,
} from "@feature-list/versions";

// 使用类型安全的功能配置
const createAuthFeature = (): AuthFeatureConfig => ({
  id: "auth",
  enabled: true,
  config: {
    sso: true,
    oauth: {
      google: true,
      github: false,
    },
  },
});
```

## 🔧 开发指南

### 构建项目

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 开发模式（监听文件变化）
npm run dev

# 清理构建文件
npm run clean
```

### 添加新功能类型

1. 在 `src/types/feature.ts` 中定义新的功能接口：

```typescript
export interface NewFeatureConfig extends BaseFeatureConfig {
  id: "new-feature";
  config?: {
    option1?: boolean;
    option2?: string;
  };
}
```

2. 将新类型添加到联合类型中：

```typescript
export type FeatureConfig =
  | AuthFeatureConfig
  | DashboardFeatureConfig
  | NewFeatureConfig; // 添加新类型
```

### 创建新版本配置

1. 在 `configs/` 目录下创建新的 JSON 配置文件
2. 在对应的版本目录下创建 TypeScript 版本定义
3. 更新 `src/configs/index.ts` 中的版本映射

## 📝 配置规范

### 基本结构

- `version`: 版本标识符
- `name`: 版本显示名称
- `features`: 功能配置数组

### 功能配置

- `id`: 功能唯一标识符
- `enabled`: 功能启用状态
- `config`: 功能具体配置参数
- `version`: 功能版本（可选）
- `dependencies`: 依赖的其他功能（可选）

## 🔄 版本管理最佳实践

1. **语义化版本**: 使用语义化版本号命名
2. **向后兼容**: 确保新版本向后兼容
3. **文档更新**: 及时更新配置文档
4. **测试验证**: 配置变更后进行充分测试
5. **渐进式发布**: 分阶段发布新功能

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 创建 Pull Request

## 📄 许可证

MIT License
