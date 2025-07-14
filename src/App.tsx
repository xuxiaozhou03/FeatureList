import React, { useState } from "react";
import DefineFeaturesEditorTab from "./components/DefineFeaturesEditorTab";
import VisualFeatureListTab from "./components/VisualFeatureListTab";
import VersionFeatureListTab from "./components/VersionFeatureListTab";
import ConfigVersionFeatureListTab from "./components/ConfigVersionFeatureListTab";
import { Card, Tabs } from "antd";
import { CodeOutlined } from "@ant-design/icons";

import styles from "./App.module.css";
import TypeDefinitionsTab from "./components/TypeDefinitionsTab";

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
      children: <DefineFeaturesEditorTab />,
    },
    {
      key: "visual-feature-list",
      label: (
        <span>
          <CodeOutlined /> 可视化功能清单
        </span>
      ),
      children: <VisualFeatureListTab />,
    },
    {
      key: "version-feature-list",
      label: (
        <span>
          <CodeOutlined /> 版本及功能清单约束
        </span>
      ),
      children: <VersionFeatureListTab />,
    },
    {
      key: "config-version-feature-list",
      label: (
        <span>
          <CodeOutlined /> 配置版本及功能清单
        </span>
      ),
      children: <ConfigVersionFeatureListTab />,
    },
    {
      key: "type-definitions",
      label: (
        <span>
          <CodeOutlined /> 类型定义
        </span>
      ),
      children: <TypeDefinitionsTab />,
    },
  ];

  return (
    <div className={styles.page}>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) =>
            setActiveTab(
              key as
                | "editor"
                | "preview"
                | "help"
                | "version-schema"
                | "version-feature-list"
                | "config-version-feature-list"
                | "type-definitions"
            )
          }
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default App;
