# enumDescriptions 功能使用说明

## 概述

`enumDescriptions` 是一个强大的功能，允许为枚举值提供详细的描述信息，提升用户体验和配置的可读性。

## 支持的场景

### 1. 字符串枚举参数

```json
{
  "theme": {
    "type": "string",
    "enum": ["light", "dark", "auto"],
    "enumDescriptions": [
      "浅色主题，适合白天使用",
      "深色主题，适合夜间使用",
      "自动主题，根据系统设置自动切换"
    ],
    "description": "界面主题设置",
    "default": "auto"
  }
}
```

### 2. 数组项枚举描述

```json
{
  "components": {
    "type": "array",
    "items": {
      "type": "string",
      "enum": ["header", "sidebar", "footer", "toolbar"],
      "enumDescriptions": ["顶部导航栏", "侧边栏菜单", "底部状态栏", "工具栏"]
    },
    "description": "启用的界面组件",
    "default": ["header", "sidebar"]
  }
}
```

### 3. 对象属性枚举描述

```json
{
  "layout": {
    "type": "object",
    "properties": {
      "width": {
        "type": "string",
        "enum": ["fixed", "fluid", "responsive"],
        "enumDescriptions": ["固定宽度布局", "流体宽度布局", "响应式布局"],
        "description": "布局宽度模式",
        "default": "responsive"
      }
    },
    "description": "布局配置"
  }
}
```

## 规则说明

### 1. 数组对应关系

- `enumDescriptions` 数组的长度必须与 `enum` 数组的长度相等
- 描述按照索引顺序对应枚举值

### 2. 自动转换

当功能清单中定义了 `enumDescriptions` 时，系统会自动将其转换到版本配置的 Schema 中：

**功能清单定义：**

```json
{
  "priority": {
    "type": "string",
    "enum": ["low", "medium", "high"],
    "enumDescriptions": ["低优先级", "中等优先级", "高优先级"]
  }
}
```

**自动生成的版本配置 Schema：**

```json
{
  "priority": {
    "type": "string",
    "enum": ["low", "medium", "high"],
    "enumDescriptions": ["低优先级", "中等优先级", "高优先级"],
    "description": "优先级设置"
  }
}
```

### 3. 嵌套支持

支持在嵌套的功能结构中使用 `enumDescriptions`：

```json
{
  "parentFeature": {
    "name": "父功能",
    "children": {
      "childFeature": {
        "name": "子功能",
        "paramSchema": {
          "option": {
            "type": "string",
            "enum": ["a", "b", "c"],
            "enumDescriptions": ["选项A", "选项B", "选项C"]
          }
        }
      }
    }
  }
}
```

## 最佳实践

### 1. 描述应该简洁明了

- 避免过长的描述文本
- 使用通俗易懂的语言
- 突出选项的核心特点

### 2. 保持一致性

- 同类型的枚举值使用相似的描述格式
- 保持术语的一致性
- 描述风格统一

### 3. 提供有用信息

- 描述应该帮助用户理解选项的用途
- 可以包含使用场景说明
- 避免重复枚举值本身的信息

## 示例文件

参考 `/src/examples/feature-with-descriptions.json` 文件查看完整的 `enumDescriptions` 使用示例。

## 注意事项

1. `enumDescriptions` 是可选的，如果不提供，系统会正常工作
2. 描述数组的长度必须与枚举数组完全匹配
3. 支持中文、英文等多语言描述
4. 在 Monaco Editor 中，这些描述会作为智能提示显示给用户
