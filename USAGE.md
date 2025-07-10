# 功能清单配置系统使用说明

## 🎯 项目概述

基于 React + TypeScript + Ant Design + Monaco Editor + Vite 构建的现代化功能清单控制系统，支持功能清单的定义、编辑、验证和管理。

## 🚀 核心功能

### 1. Monaco Editor 集成

- **组件位置**: `src/components/MonacoJsonEditor.tsx`
- **功能特性**:
  - JSON 语法高亮和自动补全
  - 实时 JSON Schema 验证
  - 代码格式化和错误提示
  - 智能代码片段（Snippets）

### 2. 功能清单配置页面

- **页面路径**: `/feature-config`
- **组件位置**: `src/pages/FeatureConfigPage.tsx`
- **核心功能**:
  - 📝 新建/编辑功能清单
  - 📋 列表查看和管理
  - 🔍 详情预览
  - 📥 导入 JSON 文件
  - 📤 导出功能清单
  - 📑 复制和删除操作

### 3. JSON Schema 验证

- **Schema 定义**: `src/schemas/featureListSchema.ts`
- **验证功能**:
  - 实时语法检查
  - 数据结构验证
  - 错误信息展示
  - 字段类型约束

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 库**: Ant Design 5
- **编辑器**: @monaco-editor/react
- **路由**: React Router DOM
- **构建工具**: Vite
- **样式**: CSS Modules

## 📁 项目结构

```
src/
├── components/
│   ├── MonacoJsonEditor.tsx      # Monaco 编辑器组件
│   ├── AppHeader.tsx             # 应用头部
│   └── AppSidebar.tsx            # 侧边栏导航
├── pages/
│   ├── FeatureConfigPage.tsx     # 功能清单配置页面
│   ├── VersionManagementPage.tsx # 版本管理页面
│   ├── FeatureStatusPage.tsx     # 功能状态页面
│   └── SchemaToolsPage.tsx       # Schema 工具页面
├── schemas/
│   └── featureListSchema.ts      # 功能清单 JSON Schema
├── types/
│   └── index.ts                  # TypeScript 类型定义
├── hooks/
│   └── index.ts                  # 自定义 Hooks
├── utils/
│   └── index.ts                  # 工具函数
└── styles/
    └── global.css                # 全局样式
```

## 🎨 使用指南

### 1. 创建功能清单

1. 点击 **"新建清单"** 按钮
2. 在 **"基本信息"** 标签页填写版本号、名称、描述
3. 切换到 **"Monaco JSON 编辑器"** 标签页
4. 使用以下工具：
   - **加载示例**: 快速加载示例数据
   - **重置为空模板**: 使用空模板开始
   - **格式化 JSON**: 美化 JSON 格式
5. 在 Monaco 编辑器中编辑 JSON 配置
6. 实时查看验证错误（如有）
7. 点击 **"保存"** 完成创建

### 2. JSON Schema 结构

```json
{
  "version": "1.0.0", // 版本号
  "name": "功能清单名称", // 清单名称
  "description": "清单描述", // 清单描述
  "features": [
    // 功能列表
    {
      "id": "feature-id", // 功能ID
      "name": "功能名称", // 功能名称
      "description": "功能描述", // 功能描述
      "type": "feature", // 功能类型: feature/experiment/rollout/permission
      "defaultEnabled": true, // 默认是否启用
      "conditions": [], // 启用条件
      "rolloutPercentage": 100, // 灰度百分比
      "metadata": {} // 元数据
    }
  ],
  "schema": {}, // 自定义 Schema
  "createdAt": "2024-01-01T00:00:00.000Z", // 创建时间
  "updatedAt": "2024-01-01T00:00:00.000Z" // 更新时间
}
```

### 3. 功能类型说明

- **feature**: 基础功能开关
- **experiment**: A/B 测试实验
- **rollout**: 灰度发布功能
- **permission**: 权限控制功能

### 4. 编辑器特性

#### 自动补全

- 输入时自动提示可用字段
- 支持代码片段快速插入
- 智能括号匹配

#### 实时验证

- JSON 语法错误立即标红
- Schema 验证错误详细提示
- 字段类型和格式检查

#### 快捷操作

- `Ctrl/Cmd + F`: 查找
- `Ctrl/Cmd + H`: 替换
- `Alt + Shift + F`: 格式化文档
- `Ctrl/Cmd + /`: 注释切换

## 🔧 开发指南

### 启动项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build
```

### 添加新功能类型

1. 在 `src/types/index.ts` 中扩展 `FeatureType` 类型
2. 在 `src/schemas/featureListSchema.ts` 中更新 Schema 定义
3. 在页面组件中更新颜色映射和显示逻辑

### 自定义 Monaco 编辑器

修改 `src/components/MonacoJsonEditor.tsx`:

- 调整编辑器主题
- 添加自定义命令
- 扩展自动补全规则
- 配置代码片段

## 📋 功能清单示例

系统提供了完整的示例数据，包含：

- 购物车功能
- AI 智能推荐
- 支付网关
- 管理面板权限
- 深色模式

## 🎯 下一步计划

- [ ] 完善版本管理功能
- [ ] 添加功能状态监控
- [ ] 集成 Schema 管理工具
- [ ] 支持批量操作
- [ ] 添加数据持久化
- [ ] 实现用户权限管理

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 发起 Pull Request

---

## 📞 技术支持

如有问题或建议，请提交 Issue 或联系开发团队。
