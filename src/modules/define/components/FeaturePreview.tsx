import React from "react";
import { Card, Typography, Space, Button, Empty, Alert } from "antd";
import {
  ExpandOutlined,
  CompressOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FolderOutlined,
  FileOutlined,
} from "@ant-design/icons";
import "./FeaturePreview.css";

const { Title, Text } = Typography;

interface FeaturePreviewProps {
  data: string;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const FeaturePreview: React.FC<FeaturePreviewProps> = ({
  data,
  isExpanded,
  onExpandChange,
}) => {
  const parseFeatureData = (data: any) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (error) {
      console.error("解析功能数据失败:", error);
      return {};
    }
  };

  const renderFeatureHierarchy = (
    features: any,
    level = 0,
    parentPath = ""
  ) => {
    if (!features || typeof features !== "object") return null;

    return Object.entries(features).map(([key, feature]: [string, any]) => {
      const hasChildren =
        feature.children && Object.keys(feature.children).length > 0;
      const hasParams =
        feature.params && Object.keys(feature.params).length > 0;
      const currentPath = parentPath ? `${parentPath}.${key}` : key;

      return (
        <div key={key} className={`feature-hierarchy-item level-${level}`}>
          <div className="feature-main-node">
            {/* 主要信息一行显示 */}
            <div
              className="flex items-center gap-1 text-xs"
              style={{ marginLeft: `${level * 12}px` }}
            >
              {hasChildren ? (
                <FolderOutlined className="text-blue-500" />
              ) : (
                <FileOutlined className="text-gray-500" />
              )}

              <Text
                strong
                className={feature.enabled ? "text-green-700" : "text-gray-500"}
              >
                {feature.name || key}
              </Text>

              <Text
                type="secondary"
                className="font-mono bg-gray-100 px-1 rounded"
              >
                {currentPath}
              </Text>

              {feature.enabled ? (
                <CheckCircleOutlined className="text-green-500" />
              ) : (
                <ExclamationCircleOutlined className="text-gray-400" />
              )}
            </div>

            {/* 描述 (如果有且较短) */}
            {feature.description && feature.description.length <= 40 && (
              <div
                className="text-xs text-gray-500 mt-1"
                style={{ marginLeft: `${level * 12 + 16}px` }}
              >
                {feature.description}
              </div>
            )}

            {/* 参数架构 (仅显示前2个) */}
            {feature.paramSchema && (
              <div
                className="text-xs mt-1"
                style={{ marginLeft: `${level * 12 + 16}px` }}
              >
                <Text className="text-orange-600">架构:</Text>
                {Object.entries(feature.paramSchema)
                  .slice(0, 2)
                  .map(([key, value]: [string, any], index) => (
                    <span key={key} className="ml-1">
                      {index > 0 && ", "}
                      <Text className="text-orange-600">{key}</Text>
                      <Text className="text-gray-600">
                        :
                        {typeof value === "object" && value !== null
                          ? value.type || "obj"
                          : String(value).substring(0, 8)}
                      </Text>
                    </span>
                  ))}
                {Object.keys(feature.paramSchema).length > 2 && (
                  <Text className="text-gray-400 ml-1">
                    +{Object.keys(feature.paramSchema).length - 2}
                  </Text>
                )}
              </div>
            )}

            {/* 参数配置 (仅显示前2个) */}
            {hasParams && (
              <div
                className="text-xs mt-1"
                style={{ marginLeft: `${level * 12 + 16}px` }}
              >
                <Text className="text-blue-600">参数:</Text>
                {Object.entries(feature.params)
                  .slice(0, 2)
                  .map(([key, value], index) => (
                    <span key={key} className="ml-1">
                      {index > 0 && ", "}
                      <Text className="text-blue-600">{key}</Text>
                      <Text className="text-gray-600">
                        :
                        {typeof value === "object"
                          ? "obj"
                          : String(value).substring(0, 8)}
                      </Text>
                    </span>
                  ))}
                {Object.keys(feature.params).length > 2 && (
                  <Text className="text-gray-400 ml-1">
                    +{Object.keys(feature.params).length - 2}
                  </Text>
                )}
              </div>
            )}

            {/* 子功能 */}
            {hasChildren && (
              <div className="mt-1">
                {renderFeatureHierarchy(
                  feature.children,
                  level + 1,
                  currentPath
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const parsedData = parseFeatureData(data);
  const hasData = Object.keys(parsedData).length > 0;

  return (
    <div className="feature-preview">
      <Card
        className="shadow-lg border-0 rounded-xl overflow-hidden"
        title={
          <div className="flex items-center justify-between py-1">
            <Space size="small">
              <InfoCircleOutlined className="text-blue-500" />
              <Title level={5} className="mb-0">
                功能清单层级
              </Title>
            </Space>
            <Button
              type="text"
              size="small"
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
            padding: isExpanded ? "12px" : "8px",
            maxHeight: isExpanded ? "none" : "500px",
            overflowY: "auto",
          },
        }}
      >
        {/* 功能说明 */}
        {!hasData && (
          <Alert
            message="功能清单定义阶段"
            description="紧凑展示功能层级结构、属性和参数配置"
            type="info"
            showIcon
            className="mb-2"
          />
        )}

        {/* 功能列表 */}
        {!hasData ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 40 }}
            description={
              <div>
                <Text type="secondary" className="text-sm">
                  暂无功能定义
                </Text>
                <br />
                <Text type="secondary" className="text-xs">
                  请在左侧编辑器中定义功能清单
                </Text>
              </div>
            }
          />
        ) : (
          <div className="feature-hierarchy-container">
            {renderFeatureHierarchy(parsedData)}
          </div>
        )}

        {/* JSON 解析错误提示 */}
        {data && typeof data === "string" && data.trim() && !hasData && (
          <Alert
            message="JSON 解析错误"
            description="请检查 JSON 格式"
            type="error"
            showIcon
            className="mb-2"
          />
        )}
      </Card>
    </div>
  );
};

export default FeaturePreview;
