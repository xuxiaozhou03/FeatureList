/**
 * 版本配置使用示例
 * 演示如何在应用中使用动态加载的版本配置
 */

import React, { useState, useEffect } from "react";
import { Card, Select, Alert, Descriptions, Badge } from "antd";
import { loadVersionConfig } from "../utils/versionLoader";
import { VersionConfig } from "@feature-list/define";

const { Option } = Select;

export const ConfigDemo: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>("community");
  const [config, setConfig] = useState<VersionConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const versions = [
    { value: "community", label: "社区版" },
    { value: "enterprise", label: "企业版" },
    { value: "professional", label: "专业版" },
    { value: "client1", label: "客户版1" },
  ];

  const loadConfig = async (version: string) => {
    setLoading(true);
    setError(null);
    try {
      const configData = await loadVersionConfig(version);
      if (configData) {
        setConfig(configData);
      } else {
        setError(`无法加载版本 ${version} 的配置`);
      }
    } catch (err) {
      setError(`加载配置时出错: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig(selectedVersion);
  }, [selectedVersion]);

  const renderFeatureStatus = (feature: any, featureName: string) => {
    if (!feature) return null;

    const isEnabled = feature.enabled;
    const hasParams = feature.params && Object.keys(feature.params).length > 0;
    const hasChildren =
      feature.children || (typeof feature === "object" && !feature.enabled);

    return (
      <Card size="small" style={{ marginBottom: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{featureName}</span>
          <Badge
            status={isEnabled ? "success" : "default"}
            text={isEnabled ? "启用" : "禁用"}
          />
        </div>

        {hasParams && (
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: "12px", color: "#666" }}>参数配置:</span>
            <div
              style={{
                fontSize: "11px",
                backgroundColor: "#f5f5f5",
                padding: "4px",
                borderRadius: "2px",
                marginTop: "4px",
              }}
            >
              {JSON.stringify(feature.params, null, 2)}
            </div>
          </div>
        )}

        {hasChildren && (
          <div style={{ marginTop: 8 }}>
            {Object.entries(feature.children || {}).map(
              ([childName, childFeature]) => (
                <div key={childName} style={{ marginLeft: 16, marginTop: 4 }}>
                  {renderFeatureStatus(childFeature, childName)}
                </div>
              )
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <Card title="版本配置演示" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>选择版本:</span>
          <Select
            value={selectedVersion}
            onChange={setSelectedVersion}
            style={{ width: 200 }}
            loading={loading}
          >
            {versions.map((version) => (
              <Option key={version.value} value={version.value}>
                {version.label}
              </Option>
            ))}
          </Select>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}

        {config && (
          <div>
            <Descriptions
              title="版本信息"
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="名称">{config.name}</Descriptions.Item>
              <Descriptions.Item label="描述">
                {config.description}
              </Descriptions.Item>
              <Descriptions.Item label="版本标识">
                {selectedVersion}
              </Descriptions.Item>
            </Descriptions>

            <h3>功能配置</h3>
            <div>
              {Object.entries(config.features).map(([featureName, feature]) =>
                renderFeatureStatus(feature, featureName)
              )}
            </div>

            <h3>原始 JSON</h3>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "12px",
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              <pre>{JSON.stringify(config, null, 2)}</pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
