/**
 * 功能特性配置接口
 * 定义单个功能特性的基本配置信息
 * @template T 特性配置的类型，默认为 Record<string, any>
 */
export interface FeatureConfig<T = Record<string, any>> {
  /** 功能特性的唯一标识符 */
  id: string;
  /** 功能特性的描述或备注 */
  remark?: string;
  /** 功能特性是否启用 */
  enabled: boolean;
  /** 子功能特性配置列表，用于构建功能特性的层级结构 */
  children?: FeatureConfig[];
  /** 可选的特性配置，具体类型根据特性而定 */
  config?: T;
}

/**
 * 版本配置接口
 * 定义应用程序版本及其包含的功能特性列表
 * @template T 功能特性配置的类型，默认为 Record<string, any>
 */
export interface VersionConfig<T = Record<string, any>> {
  /** 版本号 */
  version: string;
  /** 版本名称 */
  name: string;
  /** 该版本包含的功能特性配置列表 */
  features: FeatureConfig<T>[];
}
