# 配置管理器

这是一个用于管理不同版本功能配置的工具，使用 React + TypeScript + Tailwind CSS + Ant Design 构建。

## 功能特性

### 版本配置页面 (`/config`)

- 选择不同的版本（社区版、企业版、专业版）
- 应用配置并跳转到展示页面
- 查看版本说明
- 使用 Tailwind CSS 进行样式设计

### 功能展示页面 (`/display`)

- 展示当前版本的功能配置
- 支持通过 URL 参数切换版本 (`?version=community|enterprise|professional`)
- 实时显示功能状态和配置
- 响应式布局

## 技术栈

- **React 18** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Ant Design** - 企业级 UI 组件库
- **React Router DOM** - 客户端路由
- **Vite** - 现代化构建工具

## 使用方法

### 开发模式

\`\`\`bash
VERSION=dev-1.0.0 pnpm run dev
\`\`\`

### 构建模式

\`\`\`bash
VERSION=production-2.0.0 pnpm run build
\`\`\`

## 样式架构

项目使用 Tailwind CSS 进行样式管理，主要类名包括：

- **布局**: `flex`, `grid`, `min-h-screen`
- **间距**: `p-6`, `m-4`, `gap-3`
- **颜色**: `text-white`, `bg-gray-100`, `text-blue-600`
- **响应式**: `md:grid-cols-2`, `lg:grid-cols-3`

- React 18
- TypeScript
- Ant Design
- React Router DOM
- Vite
