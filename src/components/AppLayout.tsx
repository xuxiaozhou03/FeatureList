import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { SettingOutlined, EyeOutlined } from "@ant-design/icons";
import { VersionInfo } from "../components/VersionInfo";

const { Header, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/define",
      icon: <SettingOutlined />,
      label: <Link to="/define">功能清单</Link>,
    },
    {
      key: "/version",
      icon: <SettingOutlined />,
      label: <Link to="/version">版本</Link>,
    },
    {
      key: "/display",
      icon: <EyeOutlined />,
      label: <Link to="/display">功能展示</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-6">
        <div className="flex items-center">
          <div className="text-white text-lg font-bold mr-6">配置管理器</div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="flex-1 min-w-0"
          />
        </div>

        <div className="text-white">
          <VersionInfo />
        </div>
      </Header>

      <Content className="p-4 bg-gray-100">{children}</Content>
    </Layout>
  );
};
