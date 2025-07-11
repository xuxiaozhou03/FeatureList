import React from "react";
import Wrapper from "./Wrapper";
import MonacoJsonEditor from "./MonacoJsonEditor";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";

function generateParams(params: any) {
  return Object.entries(params || {}).reduce((acc, [key, param]) => {
    const { title, description, type, ...rest } = param as any;
    acc[key] = {
      type: type || "string",
      title: title || key,
      description,
      ...rest,
    };
    return acc;
  }, {} as any);
}

function generateProperties(features: any) {
  return Object.entries(features).reduce((acc, [key, node]) => {
    const { title, description, params, ...childNode } = node as any;
    acc[key] = {
      type: "object",
      title: title || key,
      description,
      properties: {
        params: {
          type: "object",
          title: "参数",
          description: "功能的参数列表",
          properties: generateParams(params),
          additionalProperties: false,
        },
        ...generateProperties(childNode),
      },
    };
    return acc;
  }, {} as any);
}

// 生成版本及功能清单的 schema
function generateVersionFeatureListSchema(features: any) {
  return {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "版本名称",
        description: "版本名称，如 enterprise, community 等",
      },
      description: {
        type: "string",
        title: "版本描述",
        description: "版本的详细描述信息",
      },
      features: {
        type: "object",
        title: "功能清单",
        properties: generateProperties(features),
        additionalProperties: false,
      },
    },
    required: ["version", "features"],
    additionalProperties: false,
  };
}

const VersionFeatureListTab: React.FC = () => {
  const { features } = useDefineFeatureSchema();

  const schema = generateVersionFeatureListSchema(features);

  return (
    <Wrapper
      title="版本/功能清单 JSON Schema 约束文件展示"
      description="此处展示根据功能定义自动生成的 JSON Schema 约束文件，可用于校验版本及功能清单填写。"
    >
      <MonacoJsonEditor
        schema={{}}
        value={JSON.stringify(schema, null, 2)}
        height={400}
        readOnly
      />
    </Wrapper>
  );
};

export default VersionFeatureListTab;
