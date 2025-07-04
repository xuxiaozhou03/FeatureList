# 功能清单与版本配置系统

这是一个灵活的功能清单（Feature Schema）和版本配置（Version Schema）管理系统，支持在前端 JSON 编辑器中动态配置和校验。

## 主要特性

### 1. 动态 Schema 生成

- 根据功能清单自动生成版本配置的 JSON Schema
- 支持嵌套功能结构（children）
- 参数类型可配置（string, number, boolean, array, object）
- 自动生成示例数据

### 2. 灵活的功能配置

- 支持任意深度的功能嵌套
- 参数支持多种验证规则：
  - 枚举值 (enum)
  - 数值范围 (minimum/maximum)
  - 字符串长度 (minLength/maxLength)
  - 正则表达式 (pattern)
  - 数组项配置 (items)
  - 对象属性配置 (properties)

### 3. 智能编辑器

- Monaco Editor 提供语法高亮和代码智能提示
- 实时 JSON Schema 校验
- 自动补全和错误提示
- 支持格式化和语法检查

## 使用流程

### 1. 定义功能清单

在功能清单页面定义项目的功能结构：

```json
{
  "dashboard": {
    "name": "仪表板",
    "description": "项目数据展示和监控",
    "paramSchema": {
      "layout": {
        "type": "string",
        "enum": ["grid", "list", "card"],
        "description": "布局方式",
        "default": "grid",
        "required": true
      },
      "refreshInterval": {
        "type": "number",
        "minimum": 5,
        "maximum": 3600,
        "description": "刷新间隔（秒）",
        "default": 30
      }
    }
  }
}
```

### 2. 配置版本

系统会自动根据功能清单生成版本配置结构：

```json
{
  "version": "1.0.0",
  "name": "基础版本",
  "description": "版本描述",
  "features": {
    "dashboard": {
      "enabled": true,
      "params": {
        "layout": "grid",
        "refreshInterval": 30
      }
    }
  }
}
```

## 功能清单结构

### 基础结构

```json
{
  "featureName": {
    "name": "功能显示名称",
    "description": "功能描述",
    "paramSchema": {
      "paramName": {
        "type": "参数类型",
        "description": "参数描述",
        "default": "默认值",
        "required": true/false
      }
    },
    "children": {
      "childFeature": {
        // 子功能配置，结构同上
      }
    }
  }
}
```

### 参数类型配置

#### 字符串类型

```json
{
  "type": "string",
  "enum": ["option1", "option2", "option3"],
  "minLength": 1,
  "maxLength": 100,
  "pattern": "^[a-zA-Z0-9]+$"
}
```

#### 数值类型

```json
{
  "type": "number",
  "minimum": 0,
  "maximum": 1000,
  "default": 10
}
```

#### 数组类型

```json
{
  "type": "array",
  "items": {
    "type": "string",
    "enum": ["item1", "item2", "item3"]
  },
  "default": ["item1"]
}
```

#### 对象类型

```json
{
  "type": "object",
  "properties": {
    "subProperty": {
      "type": "string",
      "description": "子属性"
    }
  }
}
```

## 版本配置结构

版本配置会自动转换为以下结构：

```json
{
  "version": "版本号",
  "name": "版本名称",
  "description": "版本描述",
  "features": {
    "featureName": {
      "enabled": true/false,
      "params": {
        // 根据功能清单的 paramSchema 自动生成
      },
      "children": {
        // 子功能配置，结构同上
      }
    }
  }
}
```

## 页面功能

### 功能清单页面

- 编辑功能清单 JSON
- 实时 Schema 校验
- 语法高亮和智能提示
- 保存到 localStorage

### 版本配置页面

- 两个标签页：
  - **版本配置**：编辑具体的版本配置
  - **动态生成的 Schema**：查看根据功能清单生成的 Schema
- 动态 Schema 生成
- 实时校验和提示

## 技术特点

1. **类型安全**：使用 TypeScript 确保类型安全
2. **动态生成**：根据功能清单实时生成版本配置结构
3. **智能校验**：Monaco Editor 提供完整的 JSON Schema 校验
4. **持久化存储**：使用 localStorage 保存配置
5. **响应式设计**：支持各种屏幕尺寸

## 示例文件

- `/src/examples/feature-examples.json` - 功能清单示例
- `/src/examples/version-examples.json` - 版本配置示例

## 扩展性

系统设计时考虑了扩展性：

- 可以添加新的参数类型
- 支持自定义校验规则
- 可以集成到任何项目管理系统中
- 支持导出/导入配置
