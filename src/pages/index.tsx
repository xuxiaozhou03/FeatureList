import React, { useState } from "react";
import DefineFeaturesEditorTab from "./components/DefineFeaturesEditorTab";
import { Card, Typography, Tabs } from "antd";
import { CodeOutlined } from "@ant-design/icons";

import styles from "./index.module.css";

const { Title, Text } = Typography;

const DefineFeaturesPage: React.FC = () => {
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
        <div className={styles.header}>
          <div>
            <Title level={3}>定义功能清单</Title>
            <Text type="secondary">
              定义功能的结构和参数Schema约束，支持嵌套功能和参数验证
            </Text>
          </div>
        </div>

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

export default DefineFeaturesPage;
