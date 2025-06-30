class ConfigService {
  private static instance: ConfigService;
  private config: VersionConfig | null = null;

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async loadRemoteConfig(version?: string): Promise<VersionConfig> {
    try {
      // 从远程API加载配置
      const response = await fetch(`/api/config/${version || "default"}`);
      const config = await response.json();
      this.config = config;
      return config;
    } catch (error) {
      console.warn("Failed to load remote config, using default:", error);
      return this.getDefaultConfig();
    }
  }

  getConfig(): VersionConfig {
    if (!this.config) {
      // 返回空的默认配置，实际配置应该通过setConfig设置
      this.config = this.getDefaultConfig();
    }
    return this.config;
  }

  private getDefaultConfig(): VersionConfig {
    return {
      version: "default",
      name: "默认版本",
      features: [],
    };
  }

  isFeatureEnabled(featureId: string): boolean {
    const config = this.getConfig();
    const feature = config.features.find((f) => f.id === featureId);
    return feature?.enabled ?? false;
  }

  getFeatureConfig<T = unknown>(featureId: string): T | undefined {
    const config = this.getConfig();
    const feature = config.features.find((f) => f.id === featureId);
    return feature?.config as T;
  }
}

export default ConfigService;
