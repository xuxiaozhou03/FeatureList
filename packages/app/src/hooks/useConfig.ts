import { useState, useEffect } from "react";
import type { AppConfig } from "../types/config";
import { getVersionType } from "../utils/dynamic-import";

let configCache: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig> {
  if (configCache) return configCache!;

  const versionType = getVersionType();

  try {
    // 尝试加载版本特定配置
    const versionConfig = await import(`../configs/features.${versionType}.ts`);
    configCache = versionConfig.default;
    return configCache!;
  } catch {
    // 回退到默认配置
    const defaultConfig = await import("../configs/features.community.ts");
    configCache = defaultConfig.default;
    return configCache!;
  }
}

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadConfig()
      .then(setConfig)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
