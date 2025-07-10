import React, { useState } from "react";
import { Card, Button, Space, Typography, Tabs, message } from "antd";
import {
  CodeOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import EditorTab from "./components/EditorTab";
import PreviewTab from "./components/PreviewTab";
import HelpTab from "./components/HelpTab";
import SchemaViewTab from "./components/SchemaViewTab";
import TypeDefTab from "./components/TypeDefTab";
import {
  FEATURE_DEFINITION_EXAMPLE,
  EMPTY_FEATURE_DEFINITION,
} from "@/schemas/featureSchema";
import styles from "./index.module.css";

const { Title, Text } = Typography;

const DefineFeaturesPage: React.FC = () => {
  const [jsonValue, setJsonValue] = useState<string>(
    JSON.stringify(FEATURE_DEFINITION_EXAMPLE, null, 2)
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "editor" | "preview" | "help" | "version-schema"
  >("editor");

  // 处理 JSON 编辑器变化
  const handleJsonChange = (value: string) => {
    setJsonValue(value);

    // 实时验证 JSON
    try {
      JSON.parse(value);
      setValidationErrors([]);
      // 这里可以添加更多的业务逻辑验证
    } catch (error) {
      setValidationErrors(["JSON 格式错误"]);
    }
  };

  // 加载示例
  const handleLoadExample = () => {
    setJsonValue(JSON.stringify(FEATURE_DEFINITION_EXAMPLE, null, 2));
    setValidationErrors([]);
    message.success("示例已加载");
  };

  // 重置为空模板
  const handleReset = () => {
    setJsonValue(JSON.stringify(EMPTY_FEATURE_DEFINITION, null, 2));
    setValidationErrors([]);
    message.success("已重置为空模板");
  };

  // 格式化 JSON
  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonValue), null, 2);
      setJsonValue(formatted);
      message.success("格式化成功");
    } catch (error) {
      message.error("JSON 格式错误，无法格式化");
    }
  };

  // 验证定义
  const handleValidate = () => {
    try {
      JSON.parse(jsonValue);
      // 这里可以添加更详细的 Schema 验证
      message.success("功能定义验证通过");
      setValidationErrors([]);
    } catch (error) {
      message.error("功能定义验证失败");
      setValidationErrors(["JSON 格式错误"]);
    }
  };

  const tabItems = [
    {
      key: "editor",
      label: (
        <span>
          <CodeOutlined /> 功能定义编辑器
        </span>
      ),
      children: (
        <EditorTab
          jsonValue={jsonValue}
          validationErrors={validationErrors}
          onJsonChange={handleJsonChange}
          onLoadExample={handleLoadExample}
          onReset={handleReset}
          onFormat={handleFormat}
          onValidate={handleValidate}
        />
      ),
    },
    {
      key: "preview",
      label: (
        <span>
          <FileTextOutlined /> 预览结果
        </span>
      ),
      children: <PreviewTab jsonValue={jsonValue} />,
    },
    {
      key: "version-schema",
      label: (
        <span>
          <FileTextOutlined /> 约束版本Schema
        </span>
      ),
      children: <SchemaViewTab jsonValue={jsonValue} />,
    },
    {
      key: "typedef",
      label: (
        <span>
          <FileTextOutlined /> TypeScript 类型定义
        </span>
      ),
      children: <TypeDefTab jsonValue={jsonValue} />,
    },
    {
      key: "help",
      label: (
        <span>
          <FileTextOutlined /> 使用说明
        </span>
      ),
      children: <HelpTab />,
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
          <Space>
            <Button icon={<PlayCircleOutlined />} onClick={handleValidate}>
              验证定义
            </Button>
          </Space>
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
