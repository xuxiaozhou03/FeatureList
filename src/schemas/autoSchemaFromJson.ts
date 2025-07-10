// 根据功能定义清单的 jsonValue 生成约束 schema，参考 FEATURE_DEFINITION_SCHEMA
import { ParameterDefinitionMap } from "./featureSchema";

/**
 * 递归生成 schema，结构参考 FEATURE_DEFINITION_SCHEMA
 */
/**
 * 通过功能清单定义生成 version 配置的约束 schema
 * version 结构: { name, description, features: { ...功能... } }
 */
export function generateVersionSchemaFromFeatureDef(featureDef: any): any {
  // 生成 features 字段的 schema
  const featuresSchema = generateSchemaFromJson(featureDef);
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "版本配置",
    description: "版本功能开关与参数约束",
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "版本名称",
        description: "如 enterprise、pro、basic 等",
      },
      description: {
        type: "string",
        title: "版本描述",
        description: "版本的详细说明",
      },
      features: featuresSchema,
    },
    required: ["name", "description", "features"],
  };
}

// 递归生成 properties，特殊处理 paramsSchema/params 和 enabled
export function generateSchemaFromJson(json: any): any {
  function walk(obj: any, isFeature = false, parentKey = ""): any {
    if (Array.isArray(obj)) {
      return {
        type: "array",
        description: "数组类型",
        items: obj.length > 0 ? walk(obj[0]) : {},
      };
    }
    if (typeof obj === "object" && obj !== null) {
      const properties: Record<string, any> = {};
      let required: string[] = [];
      let featureTitle = undefined;
      let featureDescription = undefined;
      for (const key in obj) {
        // 提取 title/description 作为 feature 的描述，不放入 properties
        if (isFeature && key === "title") {
          featureTitle = obj[key];
          continue;
        }
        if (isFeature && key === "description") {
          featureDescription = obj[key];
          continue;
        }
        // paramsSchema -> params
        if (key === "paramsSchema" && typeof obj[key] === "object") {
          properties["params"] = walk(obj[key], false, "params");
          required.push("params");
        } else if (
          typeof obj[key] === "object" &&
          obj[key] !== null &&
          key !== "paramsSchema"
        ) {
          // 递归处理子功能
          // 找出子功能的 key
          const { title, description, paramsSchema, ...restChildFeature } =
            obj[key];
          const childFeatureKey = walk(restChildFeature, true, key);
          // 若有 paramsSchema 也递归生成 params 字段
          if (paramsSchema && typeof paramsSchema === "object") {
            childFeatureKey.properties = childFeatureKey.properties || {};
            childFeatureKey.properties["params"] = walk(
              paramsSchema,
              false,
              "params"
            );
            childFeatureKey.required = childFeatureKey.required || [];
            if (!childFeatureKey.required.includes("params")) {
              childFeatureKey.required.push("params");
            }
          }
          properties[key] = {
            ...childFeatureKey,
            title: title || key,
            description: description || `功能 ${key} 的详细描述`,
          };
          required.push(key);
        } else {
          // 基础类型参数，增加详细约束，title为key转中文，description补充说明
          const type = typeof obj[key];
          properties[key] = {
            type,
            title: ParameterDefinitionMap[key],
          };
          required.push(key);
        }
      }
      // 每个功能增加 enabled 配置
      if (isFeature) {
        properties["enabled"] = {
          type: "boolean",
          description: "是否启用该功能，布尔值，默认 true",
          default: true,
        };
        required.push("enabled");
      }
      return {
        type: "object",
        title: featureTitle,
        description: featureDescription,
        properties,
        required,
      };
    }
    // 基础类型
    let desc = "";
    if (typeof obj === "string") desc = "字符串";
    else if (typeof obj === "number") desc = "数字";
    else if (typeof obj === "boolean") desc = "布尔值";
    return { type: typeof obj, description: `${parentKey}，类型：${desc}` };
  }

  // 第一层每个 key 都是功能，需加 enabled
  const properties: Record<string, any> = {};
  const required: string[] = [];
  if (typeof json === "object" && json !== null) {
    for (const key in json) {
      properties[key] = walk(json[key], true);
      required.push(key);
    }
  }

  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "功能定义清单",
    description: "定义功能清单的结构和参数约束",
    type: "object",
    properties,
    required,
  };
}
