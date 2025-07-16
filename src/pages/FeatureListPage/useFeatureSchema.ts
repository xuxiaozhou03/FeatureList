/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

function fillDefaults(schema: any, keyName?: string): unknown {
  if (schema.default !== undefined) return schema.default;
  if (schema.type === "object" && schema.properties) {
    const obj: Record<string, unknown> = {};
    for (const key in schema.properties) {
      obj[key] = fillDefaults(schema.properties[key], key);
    }
    return obj;
  }
  if (schema.type === "array" && schema.items) {
    return [fillDefaults(schema.items)];
  }
  if (schema.enum && schema.enum.length) {
    return schema.enum[0];
  }
  // enabled 字段特殊处理
  if (keyName === "enabled" && schema.type === "boolean") {
    return true;
  }
  return undefined;
}

const getFormSchema = async (schema: any) => {};

const useFeatureSchema = () => {
  const [value, setValue] = useState<any>(null);
  const [formSchema, setFormSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const onInit = async () => {
    setLoading(true);
    const ret = await fetch("/feature.schema.json");
    const schema = await ret.json();
    setValue(fillDefaults(schema));
    setLoading(false);
  };

  useEffect(() => {
    onInit();
  }, []);

  console.log(value);
  return { value, loading };
};

export default useFeatureSchema;
