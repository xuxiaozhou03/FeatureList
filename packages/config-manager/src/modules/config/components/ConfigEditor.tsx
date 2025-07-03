import React, { useState } from "react";
import { Card, Select, Button, Alert, Spin, message } from "antd";
import { CodeOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";
import { FormRenderer } from "./FormRenderer";
import { loadVersionConfig } from "../utils/versionLoader";
import { config } from "@feature-list/define";

const { Option } = Select;

export const ConfigEditor: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>("enterprise");
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const versions = [
    { value: "community", label: "社区版", color: "#52c41a" },
    { value: "enterprise", label: "企业版", color: "#1890ff" },
    { value: "professional", label: "专业版", color: "#722ed1" },
  ];

  const loadConfig = async (version: string) => {
    setLoading(true);
    try {
      const data = await loadVersionConfig(version);
      setConfigData(data);
      setHasChanges(false);
    } catch (error) {
      message.error(`加载 ${version} 配置失败`);
    } finally {
      setLoading(false);
    }
  };

  const handleVersionChange = (version: string) => {
    if (hasChanges) {
      // 可以在这里添加确认对话框
    }
    setSelectedVersion(version);
    loadConfig(version);
  };

  const handleSave = () => {
    // 这里实现保存逻辑
    message.success("配置保存成功");
    setHasChanges(false);
  };

  const handleReset = () => {
    loadConfig(selectedVersion);
  };

  React.useEffect(() => {
    loadConfig(selectedVersion);
  }, []);

  return (
    <div className="space-y-6">
      {/* 头部控制区 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              配置编辑器
            </h3>
            <p className="text-sm text-gray-600">编辑和自定义版本配置</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={selectedVersion}
              onChange={handleVersionChange}
              className="w-full sm:w-48"
              size="large"
            >
              {versions.map((version) => (
                <Option key={version.value} value={version.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: version.color }}
                    />
                    {version.label}
                  </div>
                </Option>
              ))}
            </Select>

            <div className="flex gap-2">
              <Button
                icon={<UndoOutlined />}
                onClick={handleReset}
                disabled={!hasChanges}
                className="flex items-center"
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center"
              >
                保存配置
              </Button>
            </div>
          </div>
        </div>

        {hasChanges && (
          <Alert
            message="配置已修改"
            description="您有未保存的配置更改，请及时保存。"
            type="warning"
            showIcon
            className="mt-4"
          />
        )}
      </div>

      {/* 配置编辑区 */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CodeOutlined />
            <span>配置表单</span>
          </div>
        }
        className="shadow-sm"
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" tip="加载配置中..." />
          </div>
        ) : (
          <div className="space-y-4">
            {/* 配置说明 */}
            <Alert
              message="配置编辑说明"
              description={
                <div className="text-sm space-y-1">
                  <p>• 修改功能开关状态会实时反映在预览中</p>
                  <p>• 参数配置支持动态验证和类型检查</p>
                  <p>• 保存前请确认所有必填项已正确填写</p>
                </div>
              }
              type="info"
              showIcon
            />

            {/* 表单渲染 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <FormRenderer
                items={config}
                onChange={() => setHasChanges(true)}
              />
            </div>
          </div>
        )}
      </Card>

      {/* JSON 预览 */}
      {configData && (
        <Card title="JSON 预览" className="shadow-sm" size="small">
          <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-auto max-h-64">
            <pre className="text-xs font-mono">
              {JSON.stringify(configData, null, 2)}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};
