import React, { useState } from "react";
import { Select, Tag, Menu, Layout } from "antd";
import { useFeaturesContext } from "../../core";
const { Sider, Content } = Layout;

import DashboardPanel from "./components/DashboardPanel";
import ProjectsPanel from "./components/ProjectsPanel";
import CodePanel from "./components/CodePanel";
import DocsPanel from "./components/DocsPanel";
import IndexPanel from "./components/IndexPanel";
import DemoPanel from "./components/DemoPanel";

const DemoPage: React.FC = () => {
  const { versions, currentVersion, setCurrentVersion, features } =
    useFeaturesContext();
  const menuItems = [
    {
      key: "index",
      label: (
        <>
          首页{" "}
          <Tag color="default" className="ml-1 align-middle">
            运行时
          </Tag>
        </>
      ),
      enabled: true,
    },
    {
      key: "dashboard",
      label: (
        <>
          工作台{" "}
          <Tag color="default" className="ml-1 align-middle">
            运行时
          </Tag>
        </>
      ),
      enabled: features.dashboard.enabled,
    },
    {
      key: "projects",
      label: (
        <>
          项目{" "}
          <Tag color="default" className="ml-1 align-middle">
            运行时
          </Tag>
        </>
      ),
      enabled: features.projects.enabled,
    },
    {
      key: "code",
      label: (
        <>
          代码{" "}
          <Tag color="default" className="ml-1 align-middle">
            运行时
          </Tag>
        </>
      ),
      enabled: features.code.enabled,
    },
    {
      key: "docs",
      label: (
        <>
          文档{" "}
          <Tag color="default" className="ml-1 align-middle">
            运行时
          </Tag>
        </>
      ),
      enabled: features.docs.enabled,
    },
    {
      key: "demo",
      label: (
        <>
          差异{" "}
          <Tag color="processing" className="ml-1 align-middle">
            构建时
          </Tag>
        </>
      ),
      enabled: true,
    },
  ]
    .filter((item) => item.enabled !== false)
    .map((item) => ({
      key: item.key,
      label: item.label,
    }));

  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]?.key);

  if (!features) return null;

  return (
    <Layout
      className="bg-white rounded shadow min-h-[600px]"
      style={{ overflow: "hidden" }}
    >
      <Sider
        width={180}
        className="bg-gray-50 border-r border-gray-200 !h-auto"
        style={{ minHeight: 500 }}
      >
        <div className="text-lg font-bold text-center py-6">功能菜单</div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={(e) => setSelectedMenu(e.key as string)}
          style={{ border: 0, background: "inherit" }}
        />
        <div className="px-4 mt-8">
          <div className="mb-2 font-medium">切换版本：</div>
          <Select
            value={currentVersion}
            onChange={setCurrentVersion}
            options={versions}
            className="w-full"
          />
          <div className="mt-2 text-xs text-gray-500 text-center">
            当前版本 <Tag color="blue">{currentVersion}</Tag>
          </div>
        </div>
      </Sider>
      <Layout className="flex-1">
        <Content className="p-8 overflow-auto">
          <div className="mb-6">
            {selectedMenu === "index" && <IndexPanel />}
            {selectedMenu === "dashboard" && <DashboardPanel />}
            {selectedMenu === "projects" && <ProjectsPanel />}
            {selectedMenu === "code" && <CodePanel />}
            {selectedMenu === "docs" && <DocsPanel />}
            {selectedMenu === "demo" && <DemoPanel />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DemoPage;
