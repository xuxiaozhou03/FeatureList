import React from "react";
import { Card, Typography, Space, Button, Tag, Badge } from "antd";
import {
  ExpandOutlined,
  CompressOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  BranchesOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import "./FeaturePreview.css";

const { Title, Text, Paragraph } = Typography;

interface FeaturePreviewProps {
  data: any;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const FeaturePreview: React.FC<FeaturePreviewProps> = ({
  data,
  isExpanded,
  onExpandChange,
}) => {
  const parseFeatureData = (data: any) => {
    if (!data || typeof data !== "object") return {};

    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      console.error("解析功能数据失败:", error);
      return {};
    }
  };

  const renderFeatureTree = (features: any, level = 0) => {
    if (!features || typeof features !== "object") return null;

    return Object.entries(features).map(([key, feature]: [string, any]) => {
      const hasChildren =
        feature.children && Object.keys(feature.children).length > 0;
      const hasParams =
        feature.params && Object.keys(feature.params).length > 0;

      return (
        <div key={key} className={`feature-item level-${level}`}>
          <Card
            size="small"
            className={`mb-3 shadow-sm hover:shadow-md transition-all duration-200 ${
              feature.enabled
                ? "feature-enabled border-green-300"
                : "feature-disabled border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    status={feature.enabled ? "success" : "default"}
                    text={
                      <Text
                        strong
                        className={
                          feature.enabled ? "text-green-700" : "text-gray-500"
                        }
                      >
                        {feature.name || key}
                      </Text>
                    }
                  />
                  {feature.enabled && <Tag color="success">已启用</Tag>}
                </div>

                {feature.description && (
                  <Paragraph
                    className="text-sm text-gray-600 mb-2"
                    ellipsis={{ rows: 2, expandable: true }}
                  >
                    {feature.description}
                  </Paragraph>
                )}

                {hasParams && (
                  <div className="mb-2">
                    <Space wrap>
                      <Tag icon={<SettingOutlined />} color="blue">
                        {Object.keys(feature.params).length} 个参数
                      </Tag>
                      {Object.entries(feature.params).map(
                        ([paramKey, paramValue]) => (
                          <Tag key={paramKey} className="text-xs">
                            {paramKey}: {String(paramValue)}
                          </Tag>
                        )
                      )}
                    </Space>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {hasChildren && (
                  <Badge
                    count={Object.keys(feature.children).length}
                    size="small"
                  >
                    <BranchesOutlined className="text-blue-500" />
                  </Badge>
                )}
                {hasParams && <ApiOutlined className="text-green-500" />}
              </div>
            </div>

            {hasChildren && (
              <div className="mt-3 pl-4 border-l-2 border-gray-200">
                {renderFeatureTree(feature.children, level + 1)}
              </div>
            )}
          </Card>
        </div>
      );
    });
  };

  const parsedData = parseFeatureData(data);
  const featureCount = Object.keys(parsedData).length;
  const enabledCount = Object.values(parsedData).filter(
    (f: any) => f.enabled
  ).length;

  return (
    <div className="feature-preview">
      <Card
        className="shadow-lg border-0 rounded-xl overflow-hidden"
        title={
          <div className="flex items-center justify-between">
            <Space>
              <InfoCircleOutlined className="text-blue-500" />
              <Title level={4} className="mb-0">
                功能预览
              </Title>
              <div className="flex items-center gap-2">
                <Badge count={featureCount} color="blue" />
                <Text type="secondary">个功能</Text>
                <Badge count={enabledCount} color="green" />
                <Text type="secondary">已启用</Text>
              </div>
            </Space>
            <Button
              type="text"
              icon={isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={() => onExpandChange(!isExpanded)}
              className="hover:bg-blue-50"
            >
              {isExpanded ? "收起" : "展开"}
            </Button>
          </div>
        }
        styles={{
          body: {
            padding: isExpanded ? "24px" : "16px",
            maxHeight: isExpanded ? "none" : "400px",
            overflowY: "auto",
          },
        }}
      >
        {featureCount > 0 ? (
          <div className="space-y-4">{renderFeatureTree(parsedData)}</div>
        ) : (
          <div className="text-center py-8">
            <InfoCircleOutlined className="text-4xl text-gray-300 mb-4" />
            <Text type="secondary">暂无功能配置</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FeaturePreview;
