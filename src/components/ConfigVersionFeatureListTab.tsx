import React, { useState } from "react";
import { Card } from "antd";
import MonacoJsonEditor from "./MonacoJsonEditor";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";

const ConfigVersionFeatureListTab: React.FC = () => {
  const { versionSchema, defaultVersionConfig } = useDefineFeatureSchema();

  const [value, setValue] = useState(defaultVersionConfig);
  return (
    <Card title="在线配置版本及功能清单" style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <MonacoJsonEditor
            schema={versionSchema}
            value={JSON.stringify(value, null, 2)}
            onChange={(val) => {
              const parsed = JSON.parse(val);
              setValue(parsed);
            }}
            height={400}
          />
        </div>
      </div>
    </Card>
  );
};

export default ConfigVersionFeatureListTab;
