import { useEffect, useState } from "react";
import { VersionConfig } from "./types";
import { getVersion, VersionKey } from ".";

export const useGlobalVersion = (version: VersionKey) => {
  const [config, setConfig] = useState<VersionConfig | null>(null);
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

        const result = await getVersion(version);
        setConfig(result);
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
