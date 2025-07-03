import { useState, useEffect } from "react";
import { message } from "antd";
import { VersionConfig } from "@feature-list/define";
import { loadAllVersionConfigs } from "../utils/versionLoader";

export const useVersions = () => {
  const [versions, setVersions] = useState<VersionConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化时加载版本数据
  useEffect(() => {
    const initVersions = async () => {
      setLoading(true);
      try {
        const loadedVersions = await loadAllVersionConfigs();
        setVersions(loadedVersions);
      } catch (error) {
        console.error("Failed to initialize versions:", error);
        message.error("初始化版本数据失败");
      } finally {
        setLoading(false);
      }
    };

    initVersions();
  }, []);

  const createVersion = async (versionData: VersionConfig) => {
    const newVersion: VersionConfig = versionData;

    setVersions((prev) => [...prev, newVersion]);
    message.success("版本创建成功");
    return newVersion;
  };

  const updateVersion = async (
    version: string,
    versionData: Partial<VersionConfig>
  ) => {
    setVersions((prev) =>
      prev.map((v) => (v.version === version ? { ...v, ...versionData } : v))
    );
    message.success("版本更新成功");
  };

  const deleteVersion = async (version: string) => {
    setVersions((prev) => prev.filter((v) => v.version !== version));
    message.success("删除成功");
  };

  // 重新加载版本数据
  const reloadVersions = async () => {
    setLoading(true);
    try {
      const loadedVersions = await loadAllVersionConfigs();
      setVersions(loadedVersions);
      message.success("版本数据重新加载成功");
    } catch (error) {
      console.error("Failed to reload versions:", error);
      message.error("重新加载版本数据失败");
    } finally {
      setLoading(false);
    }
  };

  return {
    versions,
    loading,
    createVersion,
    updateVersion,
    deleteVersion,
    reloadVersions,
  };
};
