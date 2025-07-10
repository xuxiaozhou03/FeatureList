import React, { useMemo } from "react";
import MonacoJsonEditor from "./MonacoJsonEditor";
import { generateSchemaFromJson } from "@/schemas/autoSchemaFromJson";
interface SchemaViewTabProps {
  jsonValue: string;
}

const SchemaViewTab: React.FC<SchemaViewTabProps> = ({ jsonValue }) => {
  // 生成 schema 逻辑已独立到 src/schemas/autoSchemaFromJson.ts

  const schemaJson = useMemo(() => {
    try {
      const obj = JSON.parse(jsonValue);
      return JSON.stringify(generateSchemaFromJson(obj), null, 2);
    } catch {
      return "无效的 JSON，无法生成 Schema";
    }
  }, [jsonValue]);
  return (
    <MonacoJsonEditor
      value={schemaJson}
      readOnly={true}
      height={500}
      language="json"
    />
  );
};

export default SchemaViewTab;
