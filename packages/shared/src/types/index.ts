/**
 * 基础功能配置接口
 * 定义功能配置的核心结构，可被继承和扩展
 */
export interface FeatureConfig<
  TParams = Record<string, any>,
  TChildren extends Record<string, any> | undefined = undefined
> {
  /** 功能名称 */
  name: string;
  /** 是否启用该功能 */
  enabled: boolean;
  /** 功能参数配置，支持泛型约束 */
  params: TParams;
  /** 功能描述信息（可选） */
  description?: string;
  /** 子功能配置（可选），支持嵌套功能结构 */
  children?: TChildren;
}

/**
 * 基础版本配置接口
 * 定义版本配置的核心结构，可被继承和扩展
 */
export interface IVersionConfig {
  /** 版本标识符 */
  version: string;
  /** 版本名称 */
  name: string;
  /** 版本描述信息 */
  description: string;
}
