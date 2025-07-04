# 🎯 功能清单与版本配置系统使用指南

## 🚀 快速开始

### 1. 定义功能清单

在**功能清单页面**定义你的项目功能结构：

1. 点击"功能清单定义"页面
2. 在 JSON 编辑器中定义功能结构
3. 点击"去配置版本"按钮

### 2. 配置版本

在**版本配置页面**有两种配置方式：

#### 🎨 可视化表单模式（推荐新手）

- 切换到"可视化表单"模式
- 填写版本基本信息
- 通过表单组件配置功能参数
- 实时预览配置结果

#### 💻 JSON 编辑器模式（推荐专家）

- 切换到"JSON 编辑器"模式
- 直接编辑 JSON 配置
- 享受语法高亮和智能提示
- 实时 Schema 校验

## 📋 功能清单结构指南

### 基础功能定义

```json
{
  "featureName": {
    "name": "功能显示名称",
    "description": "功能详细描述",
    "paramSchema": {
      // 参数配置
    },
    "children": {
      // 子功能（可选）
    }
  }
}
```

### 参数类型支持

#### 🔤 字符串参数

```json
{
  "theme": {
    "type": "string",
    "enum": ["light", "dark", "auto"],
    "enumDescriptions": ["浅色主题", "深色主题", "自动主题"],
    "description": "界面主题",
    "default": "auto",
    "required": true
  }
}
```

#### 🔢 数字参数

```json
{
  "maxUsers": {
    "type": "number",
    "minimum": 1,
    "maximum": 1000,
    "description": "最大用户数",
    "default": 100
  }
}
```

#### ✅ 布尔参数

```json
{
  "enableNotifications": {
    "type": "boolean",
    "description": "启用通知",
    "default": true
  }
}
```

#### 📝 数组参数

```json
{
  "widgets": {
    "type": "array",
    "items": {
      "type": "string",
      "enum": ["chart", "table", "graph"],
      "enumDescriptions": ["图表组件", "表格组件", "图形组件"]
    },
    "description": "可用组件",
    "default": ["chart"]
  }
}
```

#### 🏗️ 对象参数

```json
{
  "settings": {
    "type": "object",
    "properties": {
      "width": {
        "type": "string",
        "enum": ["fixed", "fluid"],
        "enumDescriptions": ["固定宽度", "流体宽度"]
      },
      "height": {
        "type": "number",
        "minimum": 100,
        "maximum": 1000
      }
    },
    "description": "布局设置"
  }
}
```

## 🎨 可视化表单特性

### 智能表单组件

- **字符串枚举** → 下拉选择框（带描述提示）
- **数字** → 数字输入框（带范围限制）
- **布尔** → 开关组件
- **数组枚举** → 多选下拉框
- **数组标签** → 标签输入框
- **对象** → 嵌套表单面板

### 用户体验优化

- 🔍 **智能提示**: 枚举值显示详细描述
- 📖 **参数说明**: 鼠标悬停显示帮助信息
- ✅ **实时验证**: 输入内容实时校验
- 🔄 **双向同步**: 表单和 JSON 实时同步

## 📂 文件架构

```
src/modules/version/
├── index.tsx              # 主页面 - 版本配置入口
├── components/
│   ├── VersionForm.tsx   # 可视化表单组件
│   └── JsonEditor.tsx    # JSON 编辑器组件
├── utils/
│   └── schemaConverter.ts # Schema 转换工具
└── README.md             # 架构说明文档
```

## 🛠️ 高级功能

### 1. 配置导出

- 支持导出为 JSON 文件
- 文件名自动包含版本号
- 可用于部署和备份

### 2. 配置重置

- 一键重置到默认配置
- 基于功能清单自动生成默认值
- 避免手动清理的麻烦

### 3. Schema 预览

- 查看动态生成的版本配置 Schema
- 了解配置结构和验证规则
- 便于集成和开发

### 4. 嵌套功能支持

- 支持无限层级的功能嵌套
- 子功能独立配置和管理
- 折叠面板优化展示体验

## 💡 最佳实践

### 1. 功能清单设计

- 使用清晰的功能名称和描述
- 为枚举值提供详细的描述信息
- 设置合理的默认值和验证规则
- 合理组织功能层级结构

### 2. 参数配置

- 必填参数设置 `required: true`
- 数字参数设置合理的 `minimum` 和 `maximum`
- 字符串参数考虑使用正则验证 `pattern`
- 数组参数提供默认选项

### 3. 用户体验

- 优先使用可视化表单模式
- 复杂配置时切换到 JSON 模式
- 定期导出配置进行备份
- 利用重置功能快速恢复

## 🔧 扩展开发

### 新增参数类型

在 `VersionForm.tsx` 的 `renderParamInput` 方法中添加新的处理逻辑：

```typescript
case "date":
  return (
    <Form.Item name={['params', paramName]} label={label}>
      <DatePicker style={{ width: '100%' }} />
    </Form.Item>
  );
```

### 自定义验证规则

在 `schemaConverter.ts` 中扩展验证规则处理：

```typescript
if (paramConfig.customRule) {
  versionParam.customRule = paramConfig.customRule;
}
```

## 📚 示例文件

- `demo-feature-schema.json` - 完整的功能清单示例
- `feature-with-descriptions.json` - 枚举描述使用示例
- `feature-examples.json` - 基础功能示例
- `version-examples.json` - 版本配置示例

这个系统为你提供了从功能定义到版本配置的完整解决方案，支持可视化操作和专业编辑，满足不同场景的需求！
