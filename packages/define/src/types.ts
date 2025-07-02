/**
 * 版本配置类型
 */
export interface VersionConfig {
  /** 版本标识符 */
  version: string;
  /** 版本名称 */
  name: string;
  // 版本描述
  description: string;
  features: {
    // 工作台
    dashbord: {
      enabled: boolean;
      params: {};
    };
    // 项目
    projects: {
      enabled: boolean;
      params: {};
      children: {
        // 流水线
        pipelines: {
          enabled: boolean;
          params: {
            // 最大流水线数量: [1, 100]
            max?: number;
          };
        };
      };
    };
    // 工作项
    issues: {
      enabled: boolean;
      params: {};
    };
    // 代码
    code: {
      enabled: boolean;
      params: {
        /* 强推 */
        force_pull: boolean;
      };
    };
  };
}
