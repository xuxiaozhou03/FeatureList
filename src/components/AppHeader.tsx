import React from "react";
import { Layout, Typography, Space, Button, Dropdown, Avatar } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  GithubOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import styles from "./AppHeader.module.css";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "系统设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "profile":
        console.log("打开个人资料");
        break;
      case "settings":
        console.log("打开系统设置");
        break;
      case "logout":
        console.log("退出登录");
        break;
    }
  };

  const handleGithubClick = () => {
    window.open("https://github.com", "_blank");
  };

  const handleHelpClick = () => {
    window.open("/docs", "_blank");
  };

  return (
    <Header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Title level={4} className={styles.title}>
            功能清单控制系统
          </Title>
        </div>
      </div>

      <div className={styles.right}>
        <Space size="middle">
          <Button
            type="text"
            icon={<GithubOutlined />}
            onClick={handleGithubClick}
            className={styles.actionButton}
          >
            GitHub
          </Button>

          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            onClick={handleHelpClick}
            className={styles.actionButton}
          >
            帮助
          </Button>

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
          >
            <div className={styles.userInfo}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span className={styles.username}>管理员</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
