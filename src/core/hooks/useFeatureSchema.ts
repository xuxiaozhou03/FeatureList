/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export interface IConfigItemSchema {
  type: string;
  title: string;
  description: string;
  enum?: string[] | number[] | boolean[];
  enumDescriptions?: string[];
  default?: string | number | boolean;
}

export interface IFeatureSchema {
  type: string;
  required?: string[];
  title: string;
  properties?: Record<string, IFeatureSchema> & {
    enabled: {
      type: boolean;
      default?: string | number | boolean;
    };
    config?: {
      type: string;
      title?: string;
      required?: string[];
      properties?: Record<string, IConfigItemSchema>;
    };
  };
}
export interface ISchema {
  type: string;
  properties: Record<string, IFeatureSchema>;
  required: string[];
  title: string;
}

function fillDefaults(schema: ISchema): any {
  const result: Record<string, any> = {};
  for (const key in schema.properties) {
    const prop = schema.properties[key];
    // 处理 enabled 字段
    if (key === "enabled" && typeof prop === "object" && "default" in prop) {
      result[key] = (prop as any).default ?? false;
      continue;
    }
    // 处理 config 字段
    if (key === "config" && typeof prop === "object" && prop.properties) {
      result[key] = fillDefaults({
        type: prop.type,
        properties: prop.properties as Record<string, IFeatureSchema>,
        required: prop.required || [],
        title: prop.title || "",
      });
      continue;
    }
    // 递归处理嵌套 properties
    if (prop.properties) {
      result[key] = fillDefaults({
        type: prop.type,
        properties: prop.properties as Record<string, IFeatureSchema>,
        required: prop.required || [],
        title: prop.title || "",
      });
    } else if ("default" in prop) {
      result[key] = (prop as any).default;
    } else {
      // 没有 default，按类型给初值
      switch (prop.type) {
        case "string":
          result[key] = "";
          break;
        case "number":
          result[key] = 0;
          break;
        case "boolean":
          result[key] = false;
          break;
        case "object":
          result[key] = {};
          break;
        case "array":
          result[key] = [];
          break;
        default:
          result[key] = null;
      }
    }
  }
  return result;
}

const useFeatureSchema = () => {
  const [defaultValue, setDefaultValue] = useState<any>(null);
  const [schema, setSchema] = useState<ISchema | null>(null);
  const [loading, setLoading] = useState(true);

  const onInit = async () => {
    setLoading(true);
    const ret = await fetch(
      import.meta.env.MODE === "production"
        ? location.href + "/feature.schema.json"
        : "/feature.schema.json"
    );
    const _schema = (await ret.json()) as ISchema;
    setSchema(_schema);
    const defaultValue = fillDefaults(_schema);
    setDefaultValue(defaultValue);
    setLoading(false);
  };

  useEffect(() => {
    onInit();
  }, []);

  return { loading, schema, defaultValue };
};

export default useFeatureSchema;
