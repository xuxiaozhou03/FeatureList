# 版本及功能清单

## 约束

```ts
interface BaseFeature<TParams = Record<string, any>> {
  // 功能名称
  name: string;
  // 是否启用该功能
  enabled: boolean;
  // 功能参数配置
  params?: Record<string, any>;
  // 子功能
  children?: Record<string, BaseFeature>;
}
interface BaseVersion {
  // 版本号
  no: string;
  // 版本描述
  description: string;
  // 功能清单
  features: Record<string, BaseFeature>;
}
```

## 真正版本及详情功能清单

> 基于约束，实现完整的版本及详细功能清单

```ts
interface Version extends BaseVersion {
  features: {
    "user-management": BaseFeature;
  };
}
```
