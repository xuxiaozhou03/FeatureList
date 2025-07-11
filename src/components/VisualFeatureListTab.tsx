import React from "react";
import Wrapper from "./Wrapper";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";
import { Tree, Tag, Typography } from "antd";
const { Text } = Typography;

const VisualFeatureListTab: React.FC = () => {
  const { features } = useDefineFeatureSchema();

  // 递归转换为 antd Tree 数据结构
  const toTreeData = (node: any, key: string): any => {
    const children: any[] = [];
    // 子功能
    Object.entries(node)
      .filter(([k]) => !["title", "description", "params"].includes(k))
      .forEach(([childKey, childNode]) => {
        if (typeof childNode === "object") {
          children.push(toTreeData(childNode, childKey));
        }
      });

    // 参数节点
    if (node.params) {
      children.unshift({
        key: key + "-params",
        title: (
          <div
            style={{
              background: "#f6f8fa",
              borderRadius: 6,
              padding: "8px 12px",
              margin: "4px 0",
            }}
          >
            <b>参数：</b>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.entries(node.params).map(([paramKey, param]) => {
                const p = param as Record<string, any>;
                return (
                  <li key={paramKey} style={{ marginBottom: 4 }}>
                    <b>{p.title || paramKey}</b>
                    <span
                      style={{
                        marginLeft: 8,
                        marginRight: 8,
                        fontSize: 12,
                        color: "#888",
                      }}
                    >
                      ({paramKey})
                    </span>
                    <Tag color="blue" style={{ marginLeft: 0 }}>
                      {p.type}
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </div>
        ),
        selectable: false,
      });
    }

    return {
      key,
      title: (
        <span>
          <b>{node.title || key}</b>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            ({key})
          </Text>
        </span>
      ),
      children,
    };
  };

  const treeData = Object.entries(features).map(([key, node]) =>
    toTreeData(node, key)
  );

  return (
    <Wrapper
      title="可视化功能清单"
      description="以树形结构展示功能清单、参数和子功能"
    >
      <div style={{ minHeight: 300 }}>
        {treeData.length === 0 ? (
          <span>暂无功能定义数据。</span>
        ) : (
          <Tree
            treeData={treeData}
            defaultExpandAll
            selectable={false}
            showLine
          />
        )}
      </div>
    </Wrapper>
  );
};

export default VisualFeatureListTab;
