import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SettingOutlined,
  BranchesOutlined,
  DashboardOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import styles from "./AppSidebar.module.css";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: "/define-features",
      icon: <SettingOutlined />,
      label: "定义功能清单",
    },
    {
      key: "/version-management",
      icon: <BranchesOutlined />,
      label: "版本管理",
    },
    {
      key: "/feature-status",
      icon: <DashboardOutlined />,
      label: "功能状态展示",
    },
    {
      key: "/schema-tools",
      icon: <CodeOutlined />,
      label: "Schema 管理工具",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      width={240}
      className={styles.sider}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className={styles.menuWrapper}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </div>
    </Sider>
  );
};

export default AppSidebar;
