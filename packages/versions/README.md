# 版本管理

## 完善版本及功能清单定义

```ts
export interface VersionConfig extends IVersionConfig {
  features: {
    "user-management": FeatureConfig<{
      /** 最大用户数 */ maxUsers: number | "unlimited";
    }>;
  };
}
```

## 在 list 目录定义不同版本

```
list
    basic.ts
    enterprise.ts
```

## 脚本

> 补全 list/index.ts
> 生成 json
