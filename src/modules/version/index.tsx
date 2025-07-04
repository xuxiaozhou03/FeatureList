import React, { useMemo } from "react";
import { Tabs } from "antd";
import {
  createVersionSchema,
  convertSchemaToTypeScript,
} from "./utils/schemaConverter";
import JsonEditor from "./components/JsonEditor";
import { useFeatureSchema } from "../hooks";

const VersionPage: React.FC = () => {
  const [featureSchema] = useFeatureSchema();

  // 根据 featureSchema 生成完整的 versionSchema
  const versionSchema = useMemo(() => {
    if (!featureSchema) {
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "版本配置",
        description: "完整的版本配置结构，包含版本信息和具体的功能配置",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      };
    }

    try {
      return createVersionSchema(featureSchema);
    } catch (error) {
      console.error("生成版本 Schema 失败:", error);
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "版本配置",
        description: "完整的版本配置结构，包含版本信息和具体的功能配置",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      };
    }
  }, [featureSchema]);

  // 生成 TypeScript 类型定义
  const typeScriptTypes = useMemo(() => {
    if (!versionSchema) return "";
    try {
      return convertSchemaToTypeScript(versionSchema);
    } catch (error) {
      console.error("生成 TypeScript 类型失败:", error);
      return "// 生成 TypeScript 类型失败，请检查功能清单格式";
    }
  }, [versionSchema]);

  return (
    <div>
      <Tabs
        defaultActiveKey="schema"
        items={[
          {
            key: "schema",
            label: "根据功能清单生成的 Schema",
            children: (
              <JsonEditor
                title="基于功能清单动态生成的版本配置 Schema"
                value={JSON.stringify(versionSchema, null, 2)}
                readOnly
                height="600px"
              />
            ),
          },
          {
            key: "ts",
            label: "根据功能清单生成的 TypeScript 类型",
            children: (
              <JsonEditor
                title="基于功能清单动态生成的 TypeScript 类型定义"
                value={typeScriptTypes}
                language="typescript"
                readOnly
                height="600px"
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default VersionPage;
