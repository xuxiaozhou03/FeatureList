import React, { useMemo } from "react";
import { Tabs, Button, message } from "antd";
import {
  CodeOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  createVersionSchema,
  convertSchemaToTypeScript,
} from "./utils/schemaConverter";
import JsonEditor from "./components/JsonEditor";
import { useFeatureSchema } from "../hooks";
import "./styles.css";

const SchemaPage: React.FC = () => {
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

  // 下载 JSON Schema
  const downloadSchema = () => {
    try {
      const blob = new Blob([JSON.stringify(versionSchema, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "version-schema.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success("JSON Schema 已下载");
    } catch (error) {
      message.error("下载失败");
    }
  };

  // 下载 TypeScript 类型定义
  const downloadTypeScript = () => {
    try {
      const blob = new Blob([typeScriptTypes], {
        type: "text/typescript",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "version-types.ts";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success("TypeScript 类型定义已下载");
    } catch (error) {
      message.error("下载失败");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Schema 生成器
              </h1>
              <p className="text-sm text-gray-600">
                基于功能清单自动生成 JSON Schema 和 TypeScript 类型定义
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm ">
          <Tabs
            defaultActiveKey="schema"
            className="schema-tabs"
            size="large"
            items={[
              {
                key: "schema",
                label: (
                  <div className="flex items-center space-x-2 px-2">
                    <CodeOutlined className="text-blue-600" />
                    <span className="font-medium">JSON Schema</span>
                  </div>
                ),
                children: (
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          版本配置 Schema
                        </h3>
                        <p className="text-sm text-gray-600">
                          基于功能清单动态生成的版本配置 JSON
                          Schema，用于验证版本配置的数据结构
                        </p>
                      </div>
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={downloadSchema}
                        className="flex items-center"
                      >
                        下载 Schema
                      </Button>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <JsonEditor
                        value={JSON.stringify(versionSchema, null, 2)}
                        readOnly
                        height="600px"
                        language="json"
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: "typescript",
                label: (
                  <div className="flex items-center space-x-2 px-2">
                    <FileTextOutlined className="text-indigo-600" />
                    <span className="font-medium">TypeScript 类型</span>
                  </div>
                ),
                children: (
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          TypeScript 类型定义
                        </h3>
                        <p className="text-sm text-gray-600">
                          基于功能清单动态生成的 TypeScript
                          接口定义，可直接用于项目开发
                        </p>
                      </div>
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={downloadTypeScript}
                        className="flex items-center"
                      >
                        下载类型定义
                      </Button>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <JsonEditor
                        value={typeScriptTypes}
                        language="typescript"
                        readOnly
                        height="600px"
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SchemaPage;
