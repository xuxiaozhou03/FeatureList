import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  SettingOutlined,
  EyeOutlined,
  AppstoreOutlined,
  CodeOutlined,
  FileTextOutlined,
  ControlOutlined,
} from "@ant-design/icons";
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
      key: "/schema",
      icon: <CodeOutlined />,
      label: <Link to="/schema">Schema 生成器</Link>,
    },
    {
      key: "/versions",
      icon: <AppstoreOutlined />,
      label: <Link to="/versions">版本管理</Link>,
    },
    {
      key: "/display",
      icon: <EyeOutlined />,
      label: <Link to="/display">版本展示</Link>,
    },
    {
      key: "/display-control",
      icon: <ControlOutlined />,
      label: <Link to="/display-control">版本控制</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-6 bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
        <div className="flex items-center">
          <div className="text-white text-xl font-bold mr-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FileTextOutlined className="text-white" />
            </div>
            FeatureList
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="flex-1 min-w-0 bg-transparent border-none"
            style={{
              backgroundColor: "transparent",
              borderBottom: "none",
            }}
          />
        </div>

        <div className="text-white">
          <VersionInfo />
        </div>
      </Header>

      <Content className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {children}
      </Content>
    </Layout>
  );
};
