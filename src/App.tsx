import React from "react";
import { Tabs } from "antd";
import FeatureTab from "./tabs/FeatureTab";
import VersionTab from "./tabs/VersionTab";
import VersionListTab from "./tabs/VersionListTab";

const App: React.FC = () => {
  return (
    <div
      style={{
        inset: 0,
        width: "100vw",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        defaultActiveKey="1"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        tabBarStyle={{ margin: 0 }}
        items={[
          {
            key: "1",
            label: "功能清单定义",
            children: <FeatureTab />,
          },
          {
            key: "2",
            label: "版本约束与类型定义",
            children: <VersionTab />,
          },
          {
            key: "3",
            label: "版本列表管理",
            children: <VersionListTab />,
          },
        ]}
      />
    </div>
  );
};

export default App;
