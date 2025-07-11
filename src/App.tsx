import React, { useState } from "react";
import DefineFeaturesEditorTab from "./components/DefineFeaturesEditorTab";
import { Card, Tabs } from "antd";
import { CodeOutlined } from "@ant-design/icons";

import styles from "./App.module.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("editor");

  const tabItems = [
    {
      key: "editor",
      label: (
        <span>
          <CodeOutlined /> 定义功能清单
        </span>
      ),
      children: (
        <React.Suspense fallback={null}>
          <DefineFeaturesEditorTab />
        </React.Suspense>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) =>
            setActiveTab(
              key as "editor" | "preview" | "help" | "version-schema"
            )
          }
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default App;
