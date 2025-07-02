import { IVersionConfig, FeatureConfig } from "../types";

/**
 * 基础功能管理器实现
 */
export class FeatureManager {
  protected config: IVersionConfig;

  constructor(config: IVersionConfig) {
    this.config = config;
  }

  /**
   * 获取版本配置
   * @param version 版本名称（这里返回当前配置，子类可以重写支持多版本）
   */
  getVersionConfig(version?: string): IVersionConfig | null {
    return this.config;
  }

  /**
   * 获取所有可用版本
   * @returns 版本列表（基础实现只返回当前版本）
   */
  getAvailableVersions(): string[] {
    return [this.config.version];
  }

  /**
   * 检查功能是否启用
   * @param version 版本名称（可选，基础实现忽略此参数）
   * @param featureName 功能名称，支持点分隔的嵌套路径
   */
  isFeatureEnabled(version: string, featureName: string): boolean;
  isFeatureEnabled(featureName: string): boolean;
  isFeatureEnabled(
    versionOrFeatureName: string,
    featureName?: string
  ): boolean {
    // 重载处理：如果只有一个参数，则作为功能名称处理
    const actualFeatureName = featureName || versionOrFeatureName;
    const feature = this.getFeatureConfig("", actualFeatureName);
    return !!feature?.enabled;
  }

  /**
   * 获取功能配置
   * 支持通过点分隔的路径获取嵌套功能配置
   * @param version 版本名称（可选，基础实现忽略此参数）
   * @param featureName 功能名称，支持嵌套路径，如 "user.profile.settings"
   * @returns 功能配置对象，如果功能不存在则返回 null
   */
  getFeatureConfig(version: string, featureName: string): FeatureConfig | null;
  getFeatureConfig(featureName: string): FeatureConfig | null;
  getFeatureConfig(
    versionOrFeatureName: string,
    featureName?: string
  ): FeatureConfig | null {
    // 重载处理：如果只有一个参数，则作为功能名称处理
    const actualFeatureName = featureName || versionOrFeatureName;

    let currentFeatures = this.config.features;
    const parts = actualFeatureName.split(".");

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // 检查当前层级的功能是否存在
      if (!currentFeatures[part]) {
        return null;
      }

      // 如果是最后一个部分，返回该功能配置
      if (i === parts.length - 1) {
        return currentFeatures[part];
      }

      // 继续向下一层级查找
      // 如果有 children 属性，则在 children 中查找，否则返回 null
      if (currentFeatures[part].children) {
        currentFeatures = currentFeatures[part].children!;
      } else {
        // 路径还没结束但没有子功能，说明路径无效
        return null;
      }
    }

    // 理论上不会执行到这里
    return null;
  }

  /**
   * 获取所有启用的功能
   * @returns 启用的功能列表
   */
  getEnabledFeatures(): Array<{ featureName: string } & FeatureConfig> {
    return Object.entries(this.config.features)
      .filter(([, feature]) => feature.enabled)
      .map(([featureName, feature]) => ({ featureName, ...feature }));
  }

  /**
   * 获取版本信息
   * @returns 版本基本信息
   */
  getVersionInfo() {
    return {
      version: this.config.version,
      name: this.config.name,
      enabledFeatures: this.getEnabledFeatures().length,
      totalFeatures: Object.keys(this.config.features).length,
    };
  }

  /**
   * 获取功能参数
   * @param featureName 功能名称
   * @returns 功能参数对象
   */
  getFeatureParams(featureName: string): Record<string, any> | null {
    const feature = this.getFeatureConfig(featureName);
    return feature?.params || null;
  }

  /**
   * 检查功能是否存在
   * @param featureName 功能名称
   * @returns 是否存在
   */
  hasFeature(featureName: string): boolean {
    return this.getFeatureConfig(featureName) !== null;
  }

  /**
   * 获取嵌套功能的所有子功能
   * @param featureName 父功能名称
   * @returns 子功能列表
   */
  getChildFeatures(featureName: string): Record<string, FeatureConfig> | null {
    const feature = this.getFeatureConfig(featureName);
    return feature?.children || null;
  }
}
