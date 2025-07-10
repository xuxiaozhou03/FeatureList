import React, { useState } from "react";
import MonacoJsonEditor from "./components/MonacoJsonEditor";
import { Alert } from "antd";

// 读取 schema 文件内容
import featureConfigSchema from "./schema/feature-config.schema.json";

const defaultJson = `{
  "featureA": {
    "title": "功能A的标题",
    "description": "功能A的描述",
    "params": {
      "params1": {
        "type": "string",
        "title": "功能A的参数1标题",
        "description": "功能A的参数1"
      }
    },
    "childFeatureB": {
      "title": "子功能B的标题",
      "description": "子功能B的描述"
    }
  }
}`;

const DefineFeaturesEditorTab: React.FC = () => {
  const [json, setJson] = useState(defaultJson);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setJson(value);
    try {
      const data = JSON.parse(value);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div>
      <MonacoJsonEditor
        value={json}
        onChange={handleChange}
        height={500}
        schema={featureConfigSchema}
      />
      {error && (
        <Alert
          message="JSON 校验失败"
          description={<pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default DefineFeaturesEditorTab;
