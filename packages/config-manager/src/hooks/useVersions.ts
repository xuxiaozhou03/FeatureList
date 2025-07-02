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
    version: "community",
    name: "社区版",
    description: "社区版功能配置",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    version: "pro-client1",
    name: "专业版 - 客户A",
    description: "专业版客户A功能配置",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  },
  {
    id: "3",
    version: "pro-client2",
    name: "专业版 - 客户B",
    description: "专业版客户B功能配置",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  },
  {
    id: "4",
    version: "enterprise",
    name: "企业版",
    description: "企业版功能配置",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
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
