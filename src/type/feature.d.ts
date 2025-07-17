export interface IFeature {
  /**
   * 工作台
   */
  dashboard: {
    // 是否启用工作台
    enabled: boolean;
    config: {
      /**
       * 最大显示项目数
       * @min 1
       * @max 100
       * @default 5
       * @description 工作台上显示的项目数量限制，超过此数量将不再
       */
      maxItems: number;
    };
  };
  // 项目
  projects: {
    // 是否启用项目
    enabled: boolean;
    config: {
      /**
       * 是否可以创建项目
       * @default true
       * @description 如果为 false，则用户无法创建新项目，只能查看已有项目
       */
      canCreate?: boolean;
    };
  };
  // 代码
  code: {
    enabled: boolean;
    // 代码编辑器配置
    repos: {
      /**
       * @default false
       */
      enabled: boolean;
    };
    /**
     * lfs
     */
    lfs: {
      enabled: boolean;
      config: {
        /**
         * 最大文件大小
         * @default 100
         */
        maxFileSize: number;
      };
    };
  };
  // 文档
  docs: {
    enabled: boolean;
    config: {
      /**
       * 文档模式
       * @default "markdown"
       * @description 文档的编辑模式，可以是 "markdown" 或 "rich-text"
       * @enum ["markdown", "rich-text"]
       * @enumDescription "markdown" - 使用 Markdown 编辑器
       * @enumDescription "rich-text" - 使用富文本编辑器
       */
      mode: "markdown" | "rich-text";
    };
  };
}
