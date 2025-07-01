import { useState, useEffect } from "react";
import { IVersionConfig } from "../types";
import { FeatureManager } from "../utils";

type OnApi = (version: string) => Promise<IVersionConfig>;

export const useVersionConfig = (onApi: OnApi, version: string) => {
  const [config, setConfig] = useState<FeatureManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!version) {
          setError("版本号不能为空");
          return;
        }

        const result = await onApi(version);
        setConfig(new FeatureManager(result));
      } catch (err) {
        setError(err instanceof Error ? err.message : "配置加载失败");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [version]);

  return { config, loading, error };
};
