# FeatureList 多版本部署演示

## 🎯 演示目标

本演示展示了如何基于功能清单实现一套代码支持多个版本部署的完整方案。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行不同版本

```bash
# 运行企业版 (包含所有功能)
npm run dev:enterprise

# 运行基础版 (仅包含基础功能)
npm run dev:basic

# 运行默认版本
npm run dev
```

### 3. 构建不同版本

```bash
# 构建企业版
npm run build:enterprise

# 构建基础版
npm run build:basic
```

## 📋 功能对比

### 企业版功能

- ✅ **用户认证** - 支持 SSO、LDAP、OAuth (Google/GitHub)
- ✅ **仪表盘** - 全功能组件 (图表、表格、KPI、日历) + 可自定义
- ✅ **基础报表** - 支持导出、定时任务、自定义字段
- ✅ **高级报表** - 数据分析、多种图表类型、实时监控
- ✅ **API 管理** - 限流控制、监控告警、自动文档生成

### 基础版功能

- ✅ **用户认证** - 基础登录注册
- ✅ **仪表盘** - 基础组件 (图表、表格)
- ✅ **基础报表** - 基础查看功能
- ❌ **高级报表** - 不包含
- ❌ **API 管理** - 不包含

## 🏗️ 技术实现

### 核心特性

1. **功能开关系统** - 基于 FeatureContext 实现
2. **配置驱动** - JSON 配置文件控制功能启用
3. **类型安全** - TypeScript 类型检查
4. **动态路由** - 根据功能配置动态注册路由
5. **按需构建** - 未启用功能不会打包

### 目录结构

```
src/
├── features/           # 功能模块
│   ├── auth/          # 用户认证
│   ├── dashboard/     # 仪表盘
│   ├── reports/       # 基础报表
│   ├── advanced-reports/  # 高级报表
│   └── api-management/    # API管理
├── shared/            # 共享模块
│   ├── components/    # 通用组件 (FeatureGate)
│   ├── contexts/      # React Context (FeatureContext)
│   ├── hooks/         # 自定义钩子 (useFeature)
│   └── types/         # 类型定义
└── config/           # 版本配置
    └── versions/     # 版本配置文件
```

### 关键组件

#### FeatureGate 组件

```tsx
<FeatureGate feature="advanced-reports">
  <AdvancedReportsPage />
</FeatureGate>
```

#### useFeature Hook

```tsx
const isEnabled = useFeature("api-management");
const config = useFeatureConfig("auth");
```

#### 版本配置

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
        "ldap": true
      }
    }
  ]
}
```

## 🧪 测试验证

### 功能验证步骤

1. **启动企业版** - 验证所有功能模块可用
2. **启动基础版** - 验证高级功能被隐藏
3. **导航测试** - 验证路由权限控制
4. **功能配置** - 验证配置驱动的功能开关

### 构建验证

```bash
# 运行构建测试脚本
chmod +x scripts/test-builds.sh
./scripts/test-builds.sh
```

## 🎨 界面展示

### 首页

- 显示当前版本信息
- 功能模块网格展示
- 版本对比表格

### 功能页面

- 根据配置动态显示功能
- 配置驱动的 UI 组件
- 功能开关的实时效果

## 📚 扩展指南

### 添加新功能模块

1. 在 `src/features/` 创建新目录
2. 实现功能组件
3. 在类型定义中添加功能配置接口
4. 在版本配置中添加功能定义
5. 在路由中注册功能页面

### 创建新版本

1. 在 `config/versions/` 创建新配置文件
2. 定义该版本的功能清单
3. 在 package.json 添加对应脚本
4. 测试构建和运行

## 🔧 开发建议

1. **渐进式开发** - 先开发基础功能，再添加高级功能
2. **功能隔离** - 每个功能模块独立开发和测试
3. **配置优先** - 通过配置控制功能，而非代码修改
4. **类型安全** - 充分利用 TypeScript 类型检查

## 📝 总结

这个演示项目完整展示了基于功能清单的多版本部署方案：

- ✅ **一套代码** - 所有版本共享同一代码库
- ✅ **配置驱动** - 通过 JSON 配置控制功能
- ✅ **按需构建** - 只打包启用的功能
- ✅ **类型安全** - TypeScript 提供开发时保障
- ✅ **易于扩展** - 模块化架构便于添加新功能

通过这种方式，可以大大提高开发效率，降低维护成本，实现真正的"一次开发，多版本部署"。
