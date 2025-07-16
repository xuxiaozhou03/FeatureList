import React from "react";
import { Layout, Menu } from "antd";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import FeatureTab from "./tabs/FeatureTab";
import VersionTab from "./tabs/VersionTab";
import VersionListTab from "./tabs/VersionListTab";

const { Header, Content } = Layout;
const menuItems = [
  { key: "/", label: <Link to="/">功能清单定义</Link> },
  { key: "/version", label: <Link to="/version">版本约束与类型定义</Link> },
  { key: "/list", label: <Link to="/list">版本列表管理</Link> },
];

const App: React.FC = () => {
  const location = useLocation();
  return (
    <Layout style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Header
        style={{
          background: "var(--color-card)",
          boxShadow: "var(--shadow)",
          padding: 0,
        }}
      >
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname === "/" ? "/" : location.pathname]}
          items={menuItems}
          style={{
            fontSize: 16,
            borderBottom: "none",
            background: "var(--color-card)",
          }}
        />
      </Header>
      <Content
        style={{
          padding: "var(--space)",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Routes>
          <Route path="/" element={<FeatureTab />} />
          <Route path="/version" element={<VersionTab />} />
          <Route path="/list" element={<VersionListTab />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
