import { VersionConfig, FeatureConfig, FeatureId } from "../types/feature";

/**
 * 版本管理工具类
 */
export class VersionManager {
  private config: VersionConfig;

  constructor(config: VersionConfig) {
    this.config = config;
  }

  /**
   * 获取版本信息
   */
  getVersion(): string {
    return this.config.version;
  }

  /**
   * 获取版本名称
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * 检查功能是否启用
   */
  isFeatureEnabled(featureId: FeatureId): boolean {
    const feature = this.getFeature(featureId);
    return feature ? feature.enabled : false;
  }

  /**
   * 获取功能配置
   */
  getFeature(featureId: FeatureId): FeatureConfig | undefined {
    return this.config.features.find((f) => f.id === featureId);
  }

  /**
   * 获取所有启用的功能
   */
  getEnabledFeatures(): FeatureConfig[] {
    return this.config.features.filter((f) => f.enabled);
  }

  /**
   * 获取功能配置参数
   */
  getFeatureConfig<T = any>(featureId: FeatureId): T | undefined {
    const feature = this.getFeature(featureId);
    return feature?.config as T;
  }

  /**
   * 检查功能配置是否存在特定选项
   */
  hasFeatureOption(featureId: FeatureId, option: string): boolean {
    const config = this.getFeatureConfig(featureId);
    return config && typeof config === "object" && option in config;
  }

  /**
   * 获取功能选项值
   */
  getFeatureOption<T = any>(
    featureId: FeatureId,
    option: string
  ): T | undefined {
    const config = this.getFeatureConfig(featureId);
    if (config && typeof config === "object" && option in config) {
      return (config as any)[option];
    }
    return undefined;
  }

  /**
   * 导出配置为 JSON
   */
  toJSON(): VersionConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * 导出配置为 YAML 格式的字符串
   */
  toYAML(): string {
    // 简单的 YAML 转换（生产环境建议使用专门的 YAML 库）
    const yamlify = (obj: any, indent = 0): string => {
      const spaces = "  ".repeat(indent);
      if (Array.isArray(obj)) {
        return obj
          .map(
            (item) =>
              `${spaces}- ${
                typeof item === "object"
                  ? "\n" + yamlify(item, indent + 1)
                  : item
              }`
          )
          .join("\n");
      } else if (typeof obj === "object" && obj !== null) {
        return Object.entries(obj)
          .map(([key, value]) => {
            if (typeof value === "object" && value !== null) {
              return `${spaces}${key}:\n${yamlify(value, indent + 1)}`;
            } else {
              return `${spaces}${key}: ${value}`;
            }
          })
          .join("\n");
      }
      return String(obj);
    };

    return yamlify(this.config);
  }
}
