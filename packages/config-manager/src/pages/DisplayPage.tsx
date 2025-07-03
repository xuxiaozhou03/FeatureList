import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Spin, Tag } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ConfigDemo } from "../modules/config/components/ConfigDemo";

export const DisplayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentVersion, setCurrentVersion] = useState<string>("enterprise");

  const versions = [
    { value: "community", label: "社区版", color: "#52c41a" },
    { value: "enterprise", label: "企业版", color: "#1890ff" },
    { value: "professional", label: "专业版", color: "#722ed1" },
  ];

  useEffect(() => {
    const version = searchParams.get("version") || "enterprise";
    setCurrentVersion(version);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [searchParams]);

  const handleBackToConfig = () => {
    navigate("/config");
  };

  const getCurrentVersionInfo = () => {
    return versions.find((v) => v.value === currentVersion) || versions[1];
  };

  const versionInfo = getCurrentVersionInfo();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToConfig}
          type="text"
          size="large"
        >
          返回配置
        </Button>

        <div className="flex items-center gap-3">
          <span>当前版本:</span>
          <Tag color={versionInfo.color} className="text-sm py-1 px-3">
            {versionInfo.label}
          </Tag>
        </div>
      </div>

      {/* 版本功能展示 */}
      <Card title={`${versionInfo.label} 功能展示`} className="mb-6">
        <Alert
          message={`您正在查看 ${versionInfo.label} 的功能配置`}
          description={`当前版本: ${currentVersion}，构建版本: ${__VERSION__}`}
          type="info"
          showIcon
          className="mb-4"
        />

        <ConfigDemo />
      </Card>

      {/* 版本特性说明 */}
      <Card title="版本特性" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {versions.map((version) => (
            <Card
              key={version.value}
              size="small"
              title={
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: version.color }}
                  />
                  {version.label}
                </div>
              }
              className={`
                ${
                  version.value === currentVersion
                    ? "opacity-100"
                    : "opacity-70"
                }
                ${version.value === currentVersion ? "border-2" : "border"}
              `}
              style={{
                borderColor:
                  version.value === currentVersion ? version.color : "#d9d9d9",
              }}
            >
              <div className="text-xs text-gray-600">
                {version.value === "community" &&
                  "基础功能，工作台、项目管理等核心功能"}
                {version.value === "enterprise" &&
                  "企业级功能，包含高级工作流、权限管理等"}
                {version.value === "professional" &&
                  "专业版功能，全功能无限制使用"}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
