import React from "react";
import {
  Card,
  Tree,
  Tag,
  Descriptions,
  Typography,
  Space,
  Collapse,
} from "antd";
import {
  FolderOutlined,
  FileTextOutlined,
  SettingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface FeatureData {
  name: string;
  description?: string;
  paramSchema?: Record<string, any>;
  children?: Record<string, FeatureData>;
}

interface FeaturePreviewProps {
  jsonData: string;
}

const FeaturePreview: React.FC<FeaturePreviewProps> = ({ jsonData }) => {
  // 解析JSON数据
  const parseJsonData = (data: string): Record<string, FeatureData> | null => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  };

  // 渲染参数配置
  const renderParamConfig = (paramSchema: Record<string, any>) => {
    if (!paramSchema || Object.keys(paramSchema).length === 0) {
      return null;
    }

    const items = Object.entries(paramSchema).map(
      ([key, config]: [string, any]) => ({
        key,
        label: key,
        children: (
          <Space direction="vertical" size="small">
            <div>
              <Tag color="blue">{config.type || "string"}</Tag>
              {config.required && <Tag color="red">必填</Tag>}
            </div>
            {config.description && (
              <Text type="secondary">{config.description}</Text>
            )}
            {config.default !== undefined && (
              <Text code>默认值: {JSON.stringify(config.default)}</Text>
            )}
            {config.enum && (
              <div>
                <Text strong>可选值: </Text>
                <Space wrap>
                  {config.enum.map((item: any, index: number) => (
                    <Tag key={index} color="geekblue">
                      {item}
                      {config.enumDescriptions?.[index] && (
                        <Text type="secondary" style={{ marginLeft: 4 }}>
                          ({config.enumDescriptions[index]})
                        </Text>
                      )}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
            {(config.minimum !== undefined || config.maximum !== undefined) && (
              <Text type="secondary">
                范围: {config.minimum !== undefined ? config.minimum : "∞"} ~{" "}
                {config.maximum !== undefined ? config.maximum : "∞"}
              </Text>
            )}
          </Space>
        ),
      })
    );

    return (
      <Collapse
        size="small"
        items={[
          {
            key: "1",
            label: (
              <Space>
                <SettingOutlined />
                参数配置 ({Object.keys(paramSchema).length}个)
              </Space>
            ),
            children: <Descriptions column={1} items={items} />,
          },
        ]}
      />
    );
  };

  // 构建树形结构数据
  const buildTreeData = (
    data: Record<string, FeatureData> | FeatureData,
    parentKey = ""
  ): any[] => {
    const result: any[] = [];

    // 如果是 Record<string, FeatureData> 格式，遍历所有功能项
    if (typeof data === "object" && !("name" in data)) {
      Object.entries(data as Record<string, FeatureData>).forEach(
        ([key, featureData]) => {
          const nodeKey = parentKey ? `${parentKey}-${key}` : key;
          const hasChildren =
            featureData.children &&
            Object.keys(featureData.children).length > 0;

          result.push({
            key: nodeKey,
            title: (
              <Space>
                {hasChildren ? <FolderOutlined /> : <FileTextOutlined />}
                <span>{featureData.name}</span>
                {featureData.paramSchema &&
                  Object.keys(featureData.paramSchema).length > 0 && (
                    <Tag color="orange">
                      {Object.keys(featureData.paramSchema).length}个参数
                    </Tag>
                  )}
              </Space>
            ),
            children: hasChildren
              ? buildTreeData(featureData.children!, nodeKey)
              : undefined,
            data: featureData,
          });
        }
      );
    }
    // 如果是单个 FeatureData，处理其 children
    else if ("children" in data && data.children) {
      Object.entries(data.children).forEach(([key, childData]) => {
        const nodeKey = parentKey ? `${parentKey}-${key}` : key;
        const hasChildren =
          childData.children && Object.keys(childData.children).length > 0;

        result.push({
          key: nodeKey,
          title: (
            <Space>
              {hasChildren ? <FolderOutlined /> : <FileTextOutlined />}
              <span>{childData.name}</span>
              {childData.paramSchema &&
                Object.keys(childData.paramSchema).length > 0 && (
                  <Tag color="orange">
                    {Object.keys(childData.paramSchema).length}个参数
                  </Tag>
                )}
            </Space>
          ),
          children: hasChildren
            ? buildTreeData(childData.children!, nodeKey)
            : undefined,
          data: childData,
        });
      });
    }

    return result;
  };

  const parsedData = parseJsonData(jsonData);

  if (!parsedData) {
    return (
      <Card title="功能清单预览">
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Text type="secondary">无法解析JSON数据，请检查格式是否正确</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card title="功能清单预览">
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            功能清单
          </Title>
          <Text type="secondary">
            共 {Object.keys(parsedData).length} 个功能模块
          </Text>
        </div>

        <Tree
          treeData={buildTreeData(parsedData)}
          defaultExpandAll
          showLine
          titleRender={(nodeData) => {
            const featureData = (nodeData as any).data;
            return (
              <div>
                <div>{nodeData.title}</div>
                {featureData.description && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {featureData.description}
                  </Text>
                )}
                {featureData.paramSchema &&
                  Object.keys(featureData.paramSchema).length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      {renderParamConfig(featureData.paramSchema)}
                    </div>
                  )}
              </div>
            );
          }}
        />
      </div>
    </Card>
  );
};

export default FeaturePreview;
