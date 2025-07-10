import React, { useMemo } from "react";
import { Alert, Tree, Empty, Typography } from "antd";
import {
  FolderOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "../index.module.css";

const { Text } = Typography;

interface PreviewTabProps {
  jsonValue: string;
}

// 递归转换对象为树形数据
const convertToTreeData = (obj: any, parentKey = ""): any[] => {
  return Object.entries(obj).map(([key, value]) => {
    const nodeKey = parentKey ? `${parentKey}-${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // 检查是否是参数配置对象（包含 type 字段）
      if ((value as any).type) {
        const paramValue = value as any;
        return {
          title: (
            <span>
              <SettingOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              <Text strong>{key}</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                ({paramValue.type})
              </Text>
              {paramValue.description && (
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  - {paramValue.description}
                </Text>
              )}
            </span>
          ),
          key: nodeKey,
          icon: <SettingOutlined />,
          children: Object.entries(paramValue)
            .filter(([k]) => k !== "type" && k !== "description")
            .map(([k, v]) => ({
              title: (
                <span>
                  <Text>{k}: </Text>
                  <Text code>
                    {typeof v === "string" ? `"${v}"` : JSON.stringify(v)}
                  </Text>
                </span>
              ),
              key: `${nodeKey}-${k}`,
              isLeaf: true,
            })),
        };
      }

      // 功能节点
      const featureValue = value as any;
      const hasTitle = featureValue.title;
      const children = convertToTreeData(value, nodeKey);

      // 特殊处理 paramsSchema 节点
      let displayName = hasTitle ? featureValue.title : key;
      let displayDescription = featureValue.description;

      if (key === "paramsSchema") {
        displayName = "属性参数";
        displayDescription = "功能参数配置";
      }

      return {
        title: (
          <span>
            <FolderOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            <Text strong>{displayName}</Text>
            {hasTitle && key !== "paramsSchema" && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                ({key})
              </Text>
            )}
            {displayDescription && (
              <Text type="secondary" style={{ marginLeft: 8 }}>
                - {displayDescription}
              </Text>
            )}
          </span>
        ),
        key: nodeKey,
        icon: <FolderOutlined />,
        children: children.length > 0 ? children : undefined,
      };
    }

    // 叶子节点
    return {
      title: (
        <span>
          <FileTextOutlined style={{ marginRight: 8, color: "#faad14" }} />
          <Text>{key}: </Text>
          <Text code>
            {typeof value === "string" ? `"${value}"` : JSON.stringify(value)}
          </Text>
        </span>
      ),
      key: nodeKey,
      icon: <FileTextOutlined />,
      isLeaf: true,
    };
  });
};
const PreviewTab: React.FC<PreviewTabProps> = ({ jsonValue }) => {
  // 将 JSON 数据转换为树形结构
  const treeData = useMemo(() => {
    try {
      const data = JSON.parse(jsonValue);
      return convertToTreeData(data);
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [jsonValue]);

  if (!treeData) {
    return (
      <div className={styles.previewContainer}>
        <Alert
          type="error"
          message="JSON 格式错误"
          description="请检查 JSON 格式是否正确"
          style={{ marginBottom: 16 }}
          showIcon
        />
      </div>
    );
  }

  if (treeData.length === 0) {
    return (
      <div className={styles.previewContainer}>
        <Alert
          type="info"
          message="功能定义预览"
          description="这里展示解析后的功能定义结构"
          style={{ marginBottom: 16 }}
          showIcon
        />
        <Empty description="暂无功能定义" />
      </div>
    );
  }

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewContent}>
        <Tree
          showIcon
          defaultExpandAll
          treeData={treeData}
          style={{
            background: "#f9f9f9",
            padding: "16px",
            borderRadius: "6px",
            border: "1px solid #d9d9d9",
          }}
        />
      </div>
    </div>
  );
};

export default PreviewTab;
