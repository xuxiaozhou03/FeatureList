import React from "react";
import { Card } from "antd";
import MonacoJsonEditor from "./MonacoJsonEditor";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";

const ConfigVersionFeatureListTab: React.FC = () => {
  const { typeDefinitions } = useDefineFeatureSchema();

  return (
    <Card title="在线配置版本及功能清单" style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <MonacoJsonEditor
            language="typescript"
            value={typeDefinitions}
            readOnly
            height={400}
          />
        </div>
      </div>
    </Card>
  );
};

export default ConfigVersionFeatureListTab;
