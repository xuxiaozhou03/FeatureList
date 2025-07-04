# 版本配置系统架构说明

## 文件结构

```
src/modules/version/
├── index.tsx                    # 主页面组件
├── components/
│   ├── VersionForm.tsx         # 可视化配置表单
│   └── JsonEditor.tsx          # JSON 编辑器组件
├── utils/
│   └── schemaConverter.ts      # Schema 转换工具
└── version.schema.json         # 版本配置 Schema
```

## 组件功能

### 1. VersionPage (主页面)

- **功能**: 版本配置的主界面
- **特性**:
  - 双编辑模式切换 (表单 ↔ JSON)
  - 动态生成 Schema 预览
  - 配置导出/重置功能
- **状态管理**: 使用 `useLocalStorageState` 持久化配置

### 2. VersionForm (可视化表单)

- **功能**: 提供直观的表单界面配置版本
- **特性**:
  - 基本信息配置 (版本号、名称、描述)
  - 功能开关控制
  - 参数类型自适应表单组件
  - 嵌套子功能支持
  - 枚举值智能提示

### 3. JsonEditor (JSON 编辑器)

- **功能**: 提供专业的 JSON 编辑体验
- **特性**:
  - Monaco Editor 语法高亮
  - 实时 Schema 校验
  - 错误提示和自动补全
  - 只读模式支持

### 4. schemaConverter (转换工具)

- **功能**: 将功能清单转换为版本配置 Schema
- **核心函数**:
  - `convertFeatureToVersionFormat`: 转换单个功能配置
  - `generateExampleData`: 生成示例数据
  - `createVersionSchema`: 创建完整的版本 Schema

## 表单组件类型支持

### 字符串类型

- **普通输入**: `<Input />`
- **枚举选择**: `<Select />` 带描述提示

### 数值类型

- **数字输入**: `<InputNumber />` 支持 min/max 限制

### 布尔类型

- **开关控制**: `<Switch />`

### 数组类型

- **多选枚举**: `<Select mode="multiple" />`
- **标签输入**: `<Select mode="tags" />`

### 对象类型

- **嵌套表单**: 递归渲染对象属性

## 用户体验优化

### 1. 智能提示

- 枚举值显示对应的描述信息
- 参数说明工具提示
- 表单验证错误提示

### 2. 双向同步

- 表单修改自动同步到 JSON
- JSON 修改自动同步到表单
- 实时预览配置结果

### 3. 操作便捷性

- 一键重置到默认配置
- 配置导出功能
- 编辑模式快速切换

## 数据流

```
功能清单 (Feature Schema)
    ↓
schemaConverter.ts (转换处理)
    ↓
版本配置 Schema (Version Schema)
    ↓
VersionForm / JsonEditor (用户编辑)
    ↓
localStorage (持久化存储)
```

## 扩展性

### 1. 新增参数类型

在 `VersionForm.tsx` 的 `renderParamInput` 方法中添加新的 case 分支。

### 2. 新增校验规则

在 `schemaConverter.ts` 中的转换函数中添加新的验证规则处理。

### 3. 自定义组件

可以轻松替换或扩展表单组件，如添加日期选择器、颜色选择器等。

## 技术栈

- **React**: 组件化开发
- **TypeScript**: 类型安全
- **Ant Design**: UI 组件库
- **Monaco Editor**: 专业代码编辑器
- **ahooks**: React Hooks 工具库

## 使用示例

### 表单模式

1. 填写基本信息 (版本号、名称、描述)
2. 展开功能配置面板
3. 开启/关闭功能开关
4. 配置功能参数
5. 处理嵌套子功能

### JSON 模式

1. 直接编辑 JSON 配置
2. 实时语法检查
3. Schema 自动校验
4. 智能代码补全

这个架构提供了灵活、直观、强大的版本配置管理能力，支持从简单的表单操作到复杂的 JSON 编辑，满足不同用户的需求。
