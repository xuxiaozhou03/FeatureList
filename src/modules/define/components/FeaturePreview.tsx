import React from "react";
import { Card, Typography, Space, Button, Empty, Alert, Tree, Tag } from "antd";
import type { TreeDataNode } from "antd";
import {
  ExpandOutlined,
  CompressOutlined,
  InfoCircleOutlined,
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

  const buildTreeData = (features: any, parentKey = ""): TreeDataNode[] => {
    if (!features || typeof features !== "object") return [];

    return Object.entries(features).map(
      ([key, feature]: [string, any]): TreeDataNode => {
        const nodeKey = parentKey ? `${parentKey}-${key}` : key;
        const isLeaf = !hasSubFeatures(feature);
        const paramCount = feature.paramSchema
          ? Object.keys(feature.paramSchema).length
          : 0;

        const title = (
          <Space size="small">
            {isLeaf ? (
              <FileOutlined className="text-gray-500" />
            ) : (
              <FolderOutlined className="text-blue-500" />
            )}
            <span className="font-medium">{feature.name || key}</span>
            {paramCount > 0 && <Tag color="orange">{paramCount}个参数</Tag>}
            {feature.description && (
              <span className="text-gray-500 text-xs">
                {feature.description.length > 30
                  ? `${feature.description.substring(0, 30)}...`
                  : feature.description}
              </span>
            )}
          </Space>
        );

        // 构建参数列表作为子节点
        const paramNodes: TreeDataNode[] = [];
        if (
          feature.paramSchema &&
          Object.keys(feature.paramSchema).length > 0
        ) {
          Object.entries(feature.paramSchema).forEach(
            ([paramKey, paramConfig]: [string, any]) => {
              const paramName = paramConfig.name || paramKey;
              const paramTitle = (
                <Space size="small">
                  <span className="text-blue-600 text-sm">
                    {paramName}({paramKey})
                  </span>
                  <Tag color="blue">{paramConfig.type || "unknown"}</Tag>
                </Space>
              );

              paramNodes.push({
                key: `${nodeKey}-param-${paramKey}`,
                title: paramTitle,
                isLeaf: true,
                selectable: false,
              });
            }
          );
        }

        const children: TreeDataNode[] = [
          ...paramNodes,
          ...buildTreeData(getSubFeatures(feature), nodeKey),
        ];

        return {
          key: nodeKey,
          title,
          children: children.length > 0 ? children : undefined,
          isLeaf,
        };
      }
    );
  };

  const hasSubFeatures = (feature: any) => {
    if (!feature || typeof feature !== "object") return false;

    // 检查除了 name、description、paramSchema 之外是否还有其他属性
    const keys = Object.keys(feature);
    return keys.some(
      (key) => !["name", "description", "paramSchema"].includes(key)
    );
  };

  const getSubFeatures = (feature: any) => {
    if (!feature || typeof feature !== "object") return {};

    // 提取除了 name、description、paramSchema 之外的所有属性作为子功能
    const subFeatures: any = {};
    Object.keys(feature).forEach((key) => {
      if (!["name", "description", "paramSchema"].includes(key)) {
        subFeatures[key] = feature[key];
      }
    });
    return subFeatures;
  };

  const parsedData = parseFeatureData(data);
  const hasData = Object.keys(parsedData).length > 0;
  const treeData = hasData ? buildTreeData(parsedData) : [];

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
            description="树形展示功能层级结构和参数数量"
            type="info"
            showIcon
            className="mb-2"
          />
        )}

        {/* 功能树 */}
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
          <Tree
            showLine
            showIcon
            defaultExpandAll
            treeData={treeData}
            className="feature-tree"
          />
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
