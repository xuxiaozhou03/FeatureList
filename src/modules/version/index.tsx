import React, { useMemo, useState } from "react";
import { useFeatureSchema } from "../define";
import { useLocalStorageState } from "ahooks";
import { Card, Tabs, Button, Space, message, Radio } from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { createVersionSchema } from "./utils/schemaConverter";
import VersionForm from "./components/VersionForm";
import JsonEditor from "./components/JsonEditor";

type EditMode = "form" | "json";

const VersionPage: React.FC = () => {
  const [featureSchema] = useFeatureSchema();
  const [editMode, setEditMode] = useState<EditMode>("form");

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

  // 解析功能清单
  const parsedFeatureSchema = useMemo(() => {
    if (!featureSchema) return {};
    try {
      return typeof featureSchema === "string"
        ? JSON.parse(featureSchema)
        : featureSchema;
    } catch (error) {
      console.error("解析功能清单失败:", error);
      return {};
    }
  }, [featureSchema]);

  // 生成默认的版本配置数据
  const defaultVersionConfig = useMemo(() => {
    return (
      (versionSchema as any).example || {
        version: "1.0.0",
        name: "新版本",
        description: "版本描述",
        features: {},
      }
    );
  }, [versionSchema]);

  // 使用 localStorage 存储版本配置
  const [versionConfig, setVersionConfig] = useLocalStorageState(
    "version-config",
    JSON.stringify(defaultVersionConfig, null, 2)
  );

  // 解析版本配置对象
  const versionConfigObject = useMemo(() => {
    try {
      return JSON.parse(versionConfig || "{}");
    } catch (error) {
      console.error("解析版本配置失败:", error);
      return defaultVersionConfig;
    }
  }, [versionConfig, defaultVersionConfig]);

  // 处理表单数据变化
  const handleFormChange = (formData: any) => {
    const jsonString = JSON.stringify(formData, null, 2);
    setVersionConfig(jsonString);
  };

  // 处理 JSON 编辑器数据变化
  const handleJsonChange = (jsonString: string) => {
    setVersionConfig(jsonString);
  };

  // 重置配置
  const handleReset = () => {
    const newConfig = JSON.stringify(defaultVersionConfig, null, 2);
    setVersionConfig(newConfig);
    message.success("已重置为默认配置");
  };

  // 导出配置
  const handleExport = () => {
    try {
      const configData = JSON.parse(versionConfig || "{}");
      const blob = new Blob([JSON.stringify(configData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `version-config-${configData.version || "latest"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success("配置已导出");
    } catch (error) {
      message.error("导出失败，请检查 JSON 格式");
    }
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="config"
        items={[
          {
            key: "config",
            label: "版本配置",
            children: (
              <div>
                <Card
                  title="版本配置编辑器"
                  size="small"
                  extra={
                    <Space>
                      <Radio.Group
                        value={editMode}
                        onChange={(e) => setEditMode(e.target.value)}
                        buttonStyle="solid"
                      >
                        <Radio.Button value="form">可视化表单</Radio.Button>
                        <Radio.Button value="json">JSON 编辑器</Radio.Button>
                      </Radio.Group>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        type="default"
                      >
                        重置配置
                      </Button>
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={handleExport}
                        type="primary"
                      >
                        导出配置
                      </Button>
                    </Space>
                  }
                >
                  {editMode === "form" ? (
                    <VersionForm
                      featureSchema={parsedFeatureSchema}
                      value={versionConfigObject}
                      onChange={handleFormChange}
                    />
                  ) : (
                    <JsonEditor
                      title=""
                      value={versionConfig || ""}
                      onChange={handleJsonChange}
                      schema={versionSchema}
                      height="600px"
                    />
                  )}
                </Card>
              </div>
            ),
          },
          {
            key: "schema",
            label: "动态生成的 Schema",
            children: (
              <JsonEditor
                title="基于功能清单动态生成的版本配置 Schema"
                value={JSON.stringify(versionSchema, null, 2)}
                readOnly
                height="600px"
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default VersionPage;
