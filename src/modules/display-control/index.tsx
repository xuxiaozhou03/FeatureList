import { useState } from "react";
import { Card, Button, Space, Typography, Tabs, Badge } from "antd";
import {
  SwapOutlined,
  EyeOutlined,
  AppstoreOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import Test from "./components/test";

const { Title, Paragraph } = Typography;

const DisplayControlPage = () => {
  const [currentVersion, setCurrentVersion] = useState<
    "community" | "enterprise"
  >("community");

  const versionInfo = {
    community: {
      name: "社区版",
      color: "blue",
      description: "基础功能，满足个人和小团队需求",
      icon: <AppstoreOutlined />,
    },
    enterprise: {
      name: "企业版",
      color: "gold",
      description: "高级功能，企业级解决方案",
      icon: <RocketOutlined />,
    },
  };

  const VersionComparisonComponent = () => {
    const comparisonData = [
      { feature: "基础功能", community: "✓", enterprise: "✓" },
      { feature: "高级分析", community: "✗", enterprise: "✓" },
      { feature: "团队协作", community: "最多3人", enterprise: "无限制" },
      { feature: "存储空间", community: "1GB", enterprise: "无限制" },
      { feature: "技术支持", community: "社区支持", enterprise: "7×24小时" },
    ];

    return (
      <div className="space-y-4">
        <Title level={4}>版本功能对比</Title>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="border p-3 text-left">功能</th>
                <th className="border p-3 text-center">社区版</th>
                <th className="border p-3 text-center">企业版</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-3 font-medium">{item.feature}</td>
                  <td className="border p-3 text-center">{item.community}</td>
                  <td className="border p-3 text-center">{item.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabItems = [
    {
      key: "display",
      label: (
        <Space>
          <EyeOutlined />
          版本展示
        </Space>
      ),
      children: (
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Title level={4} className="mb-2">
                  当前版本: {versionInfo[currentVersion].name}
                </Title>
                <Paragraph className="text-gray-600">
                  {versionInfo[currentVersion].description}
                </Paragraph>
              </div>
              <Space>
                <Badge color={versionInfo[currentVersion].color} />
                <Button
                  type="primary"
                  icon={<SwapOutlined />}
                  onClick={() =>
                    setCurrentVersion(
                      currentVersion === "community"
                        ? "enterprise"
                        : "community"
                    )
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                >
                  切换到{currentVersion === "community" ? "企业版" : "社区版"}
                </Button>
              </Space>
            </div>
          </div>
          <Test />
        </div>
      ),
    },
    {
      key: "comparison",
      label: (
        <Space>
          <SwapOutlined />
          版本对比
        </Space>
      ),
      children: (
        <div className="p-6">
          <VersionComparisonComponent />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            版本控制中心
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            切换和对比不同版本的功能配置，实时查看版本差异
          </Paragraph>
        </div>

        {/* 主要内容 */}
        <Card className="shadow-lg border-0 rounded-xl overflow-hidden backdrop-blur-sm bg-white/90">
          <Tabs
            defaultActiveKey="display"
            className="custom-tabs"
            items={tabItems}
          />
        </Card>
      </div>
    </div>
  );
};

export default DisplayControlPage;
