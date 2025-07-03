import React from "react";
import { Card, Spin, Alert, Tag, Descriptions } from "antd";
import { useVersions } from "../hooks/useVersions";

export const VersionLoader: React.FC = () => {
  const { versions, loading, reloadVersions } = useVersions();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>加载版本配置中...</p>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <Alert
        message="没有找到版本配置"
        description="请检查 public/list.json 和相关配置文件是否存在"
        type="warning"
        showIcon
        action={<button onClick={reloadVersions}>重新加载</button>}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>动态加载的版本配置</h2>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        从 public/list.json 递归加载的 {versions.length} 个版本配置
      </p>

      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        }}
      >
        {versions.map((version) => (
          <Card
            key={version.version}
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{version.name}</span>
                <Tag color="blue">{version.version}</Tag>
              </div>
            }
            size="small"
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="版本ID">
                {version.version}
              </Descriptions.Item>
              <Descriptions.Item label="描述">
                {version.description}
              </Descriptions.Item>
            </Descriptions>

            {version.features && (
              <div style={{ marginTop: "12px" }}>
                <h4>功能配置:</h4>
                <div
                  style={{
                    fontSize: "12px",
                    backgroundColor: "#f5f5f5",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <pre>{JSON.stringify(version.features, null, 2)}</pre>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={reloadVersions} style={{ padding: "8px 16px" }}>
          重新加载配置
        </button>
      </div>
    </div>
  );
};
