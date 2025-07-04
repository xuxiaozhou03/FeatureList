import React, { useMemo } from "react";
import { Tabs, Card, Typography, Space } from "antd";
import { CodeOutlined, FileTextOutlined } from "@ant-design/icons";
import {
  createVersionSchema,
  convertSchemaToTypeScript,
} from "./utils/schemaConverter";
import JsonEditor from "./components/JsonEditor";
import { useFeatureSchema } from "../hooks";
import "./styles.css";

const { Title, Paragraph } = Typography;

const VersionPage: React.FC = () => {
  const [featureSchema] = useFeatureSchema();

  // 根据 featureSchema 生成完整的 versionSchema
  const versionSchema = useMemo(() => {
    if (!featureSchema) {
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "版本配置",
        description: "完整的版本配置结构，包含版本信息和具体的功能配置",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      };
    }

    try {
      return createVersionSchema(featureSchema);
    } catch (error) {
      console.error("生成版本 Schema 失败:", error);
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "版本配置",
        description: "完整的版本配置结构，包含版本信息和具体的功能配置",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      };
    }
  }, [featureSchema]);

  // 生成 TypeScript 类型定义
  const typeScriptTypes = useMemo(() => {
    if (!versionSchema) return "";
    try {
      return convertSchemaToTypeScript(versionSchema);
    } catch (error) {
      console.error("生成 TypeScript 类型失败:", error);
      return "// 生成 TypeScript 类型失败，请检查功能清单格式";
    }
  }, [versionSchema]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            版本 Schema 生成器
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            基于功能清单自动生成版本配置的 JSON Schema 和 TypeScript 类型定义
          </Paragraph>
        </div>

        {/* 主要内容 */}
        <Card
          className="shadow-lg border-0 backdrop-blur-sm bg-white/80 rounded-xl overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          <Tabs
            defaultActiveKey="schema"
            className="schema-tabs"
            items={[
              {
                key: "schema",
                label: (
                  <Space>
                    <CodeOutlined />
                    JSON Schema
                  </Space>
                ),
                children: (
                  <div className="p-6">
                    <JsonEditor
                      title="基于功能清单动态生成的版本配置 Schema"
                      value={JSON.stringify(versionSchema, null, 2)}
                      readOnly
                      height="600px"
                    />
                  </div>
                ),
              },
              {
                key: "ts",
                label: (
                  <Space>
                    <FileTextOutlined />
                    TypeScript 类型
                  </Space>
                ),
                children: (
                  <div className="p-6">
                    <JsonEditor
                      title="基于功能清单动态生成的 TypeScript 类型定义"
                      value={typeScriptTypes}
                      language="typescript"
                      readOnly
                      height="600px"
                    />
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default VersionPage;
