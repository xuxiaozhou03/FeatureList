# 版本管理

## 完善版本及功能清单定义

```ts
export interface VersionConfig {
  /** 版本标识符 */
  version: string;
  /** 版本名称 */
  name: string;
  features: {
    dashbord: {
      name: "工作台";
      enabled: boolean;
      params: {};
    };
    projects: {
      name: "项目";
      enabled: boolean;
      params: {};
      children: {
        pipelines: {
          name: "流水线";
          enabled: boolean;
          params: {};
        };
      };
    };
    issues: {
      name: "工作项";
      enabled: boolean;
      params: {};
    };
    code: {
      name: "代码";
      enabled: boolean;
      params: {};
    };
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
> 生成 json, yml

## 界面配置
