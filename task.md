# 开发任务

## 技术栈

- react + typescript + antd + css module

## 定义功能清单

- 可视化 antd 的配置方式
- 一个 feature
  - 功能名称(name)
  - 功能描述（descritpion）（可选）
  - 功能参数（params）（可选）
    - 一个参数包含
      - 类型： type：string, number, boolean, enum
      - 参数名称
      - 参数描述
      - 枚举值: enum
        - label：枚举值描述
        - value：枚举值
      - 默认值
    - 一个 feature
    - 一个 feature

### 需求说明

1. 展示所有已配置的版本，支持增删改查。
2. 每个版本包含名称、描述、功能清单。
3. 支持版本的快速切换和对比。
4. 支持版本的导入导出（JSON）。

### 页面结构

- 版本列表页：展示所有版本，支持新建、编辑、删除、导入、导出。
- 版本详情页：展示单个版本的详细配置。

### 主要交互流程

[//]-------------------------

## 开发流程分步

### 第一步：定义功能清单

1. 设计并实现 IDefineFeature 类型的数据结构。
2. 前端页面实现功能清单的可视化展示（树形结构）。
3. 支持功能的增删改查、参数配置、嵌套子功能。
4. 参数类型支持 string、number、boolean、enum，枚举值可配置。
5. 所有数据变更实时同步到页面状态。
6. 验收标准：功能清单结构清晰，操作无误，数据结构符合 IDefineFeature 类型。

### 第二步：配置版本/功能清单

1. 设计并实现 IVersion 类型的数据结构。
2. 前端页面实现版本的增删改查、切换、导入导出。
3. 版本配置页支持功能启用/禁用、参数赋值、嵌套功能递归配置。
4. 支持版本的导入导出（JSON），数据结构校验。
5. 所有数据变更实时同步到页面状态。
6. 验收标准：版本配置流程完整，数据结构符合 IVersion 类型，功能启用/参数赋值/嵌套配置无误。
   [//]-------------------------
7. 新建版本：弹窗输入名称、描述，进入配置页面。
8. 编辑版本：点击进入详情页，修改功能清单。
9. 删除版本：列表页操作，二次确认。
10. 导入/导出：支持本地文件上传/下载。

### 数据流

- 版本数据存储于本地（可扩展为后端接口）。
- 采用 TypeScript 类型约束，保证数据结构一致性。

### 验收标准

1. 版本列表展示完整，操作无误。
2. 版本配置可视化，交互流畅。
3. 数据结构符合 IVersion 类型定义。
4. 支持多层嵌套功能清单。
5. 导入导出无数据丢失。

## 配置单个版本

### 需求说明

1. 支持对单个版本的所有功能进行可视化配置。
2. 功能清单支持多层嵌套，参数类型多样（string, number, boolean, enum）。
3. 参数支持默认值、枚举值选择。
4. 子功能可递归添加和配置。

### 页面结构

- 版本配置页：左侧为功能树，右侧为参数配置区。
- 支持功能的增删改查，参数的动态渲染。

### 主要交互流程

1. 选择/添加功能：左侧树形结构操作。
2. 配置参数：右侧表单区，根据类型动态渲染输入控件。
3. 添加子功能：支持递归添加。
4. 保存配置：校验数据结构，保存到本地或后端。

### 数据流

- 配置数据实时同步到页面状态。
- 保存时校验并转为 IVersion 类型。

### 验收标准

1. 功能树结构清晰，支持多层嵌套。
2. 参数配置区根据类型动态渲染。
3. 数据保存后结构正确。
4. 支持所有类型参数和枚举值。
5. 子功能递归配置无误。
6. UI 交互友好，操作无误。
7. 支持配置的导入导出。

## 配置单个版本

```typescript
// 定义feature符合 IDefineFeature 结构
interface IDefineFeature {
  name: string;
  description?: string;
  params?: [
    {
      type: string | boolean | number | enum;
      name: string;
      description?: string;
      enum?: Array<{ label: string; value: string | number | boolean }>;
    }
  ];
  children?: IDefineFeature[];
}
// 期望得到的完整的版本类型
interface IVersion {
  name: string;
  description?: string;
  features: {
    [featureName: string]: {
      enabled: boolean;
      params: {
        [paramName: string]: string | boolean | number;
      };
      [childFeatureName1: string]: IVersion["features"][""];
    };
  };
}
```
