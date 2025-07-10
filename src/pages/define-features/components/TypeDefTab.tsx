import React, { useMemo } from "react";
import MonacoJsonEditor from "./MonacoJsonEditor";
import { generateSchemaFromJson } from "@/schemas/autoSchemaFromJson";

interface TypeDefTabProps {
  jsonValue: string;
}

function generateParams(params: any): string {
  if (!params) {
    return "";
  }
  return Object.entries(params)
    .map(([key, value]) => {
      const { type = "string", description } = value as any;
      // if (typeof value === "object") {
      //   return `${key}: ${generateParams(value)}`;
      // }
      console.log(value);
      return `
        // ${description}
        ${key}: ${type}`;
    })
    .join("; ");
}

// 递归生成 featuresType
function genFeaturesType(config: any): string {
  let type = "";
  Object.entries(config || {}).forEach(([key, value]) => {
    const { title, properties } = value as any;
    const { enabled, params, ...childProperties } = properties as any;
    type += `
    // ${title}
    ${key}: {
      enabled?: boolean; // 是否启用该功能，布尔值，默认 true
      ${params ? `params?: { ${generateParams(params)} \n};` : ""}
      ${
        Object.keys(childProperties).length > 0
          ? `\n${genFeaturesType(childProperties)}`
          : ""
      }
    }`;
  });
  return type;
}
const TypeDefTab: React.FC<TypeDefTabProps> = ({ jsonValue }) => {
  // 通过 schemaJson 生成 TypeScript 类型定义（简单实现）
  const tsDef = useMemo(() => {
    try {
      const obj = JSON.parse(jsonValue);
      const schema = generateSchemaFromJson(obj);

      const featuresType = genFeaturesType(schema.properties);

      return `export interface IVersion {\n  name: string; // 版本名称\n  description: string; // 版本描述\n  features: { ${featuresType} \n }\n}`;
    } catch {
      return "无效的 JSON，无法生成 TypeScript 类型";
    }
  }, [jsonValue]);

  return (
    <MonacoJsonEditor
      value={tsDef}
      readOnly={true}
      height={500}
      language="typescript"
    />
  );
};

export default TypeDefTab;
