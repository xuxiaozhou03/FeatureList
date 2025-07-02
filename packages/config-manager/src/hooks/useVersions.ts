import { useState } from "react";
import { message } from "antd";
import { VersionConfig } from "@feature-list/define";

export interface VersionItem
  extends Pick<VersionConfig, "name" | "version" | "description"> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const initialVersions: VersionItem[] = [
  {
    id: "1",
    version: "1.0.0",
    name: "基础版本",
    description: "系统基础功能版本",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    version: "1.1.0",
    name: "增强版本",
    description: "增加了项目管理功能",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
];

export const useVersions = () => {
  const [versions, setVersions] = useState<VersionItem[]>(initialVersions);

  const createVersion = (
    versionData: Omit<VersionItem, "id" | "createdAt" | "updatedAt">
  ) => {
    const newVersion: VersionItem = {
      ...versionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setVersions((prev) => [...prev, newVersion]);
    message.success("版本创建成功");
    return newVersion;
  };

  const updateVersion = (id: string, versionData: Partial<VersionItem>) => {
    const updatedVersion = {
      ...versionData,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setVersions((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedVersion } : v))
    );
    message.success("版本更新成功");
  };

  const deleteVersion = (id: string) => {
    setVersions((prev) => prev.filter((v) => v.id !== id));
    message.success("删除成功");
  };

  return {
    versions,
    createVersion,
    updateVersion,
    deleteVersion,
  };
};
