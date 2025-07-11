import React from "react";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";
import MonacoJsonEditor from "./MonacoJsonEditor";
import styles from "./style.module.css";
import { Typography } from "antd";
const { Title, Text } = Typography;

const DefineFeaturesEditorTab: React.FC = () => {
  const { data, setData, featureConfigSchema } = useDefineFeatureSchema();

  return (
    <div>
      <div className={styles.header}>
        <div>
          <Title level={3}>定义功能清单</Title>
          <Text type="secondary">
            定义功能的结构和参数Schema约束，支持嵌套功能和参数验证
          </Text>
        </div>
      </div>
      <MonacoJsonEditor
        value={data}
        height={500}
        schema={featureConfigSchema}
        onChange={(value) => {
          setData(value);
        }}
      />
    </div>
  );
};

export default DefineFeaturesEditorTab;
