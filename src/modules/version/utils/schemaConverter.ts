/**
 * 功能清单转换为版本配置 Schema 的工具函数
 */

export interface FeatureConfig {
  name: string;
  description?: string;
  paramSchema?: Record<string, any>;
  children?: Record<string, FeatureConfig>;
}

export interface VersionSchema {
  $schema: string;
  title: string;
  description: string;
  type: string;
  properties: any;
  required: string[];
  additionalProperties: boolean;
  example?: any;
}

/**
 * 转换功能配置为版本格式
 */
export const convertFeatureToVersionFormat = (feature: FeatureConfig): any => {
  const versionFeature: any = {
    type: "object",
    properties: {
      enabled: {
        type: "boolean",
        description: "是否启用此功能",
      },
    },
    required: ["enabled"],
    additionalProperties: false,
  };

  // 如果有参数配置，添加 params 属性
  if (feature.paramSchema && Object.keys(feature.paramSchema).length > 0) {
    versionFeature.properties.params = {
      type: "object",
      description: "功能参数配置",
      properties: {},
      additionalProperties: false,
    };

    // 转换参数配置
    Object.entries(feature.paramSchema).forEach(
      ([paramName, paramConfig]: [string, any]) => {
        const versionParam: any = {
          type: paramConfig.type,
          description: paramConfig.description || "",
        };

        // 复制验证规则
        if (paramConfig.enum) versionParam.enum = paramConfig.enum;
        if (paramConfig.enumDescriptions)
          versionParam.enumDescriptions = paramConfig.enumDescriptions;
        if (paramConfig.minimum !== undefined)
          versionParam.minimum = paramConfig.minimum;
        if (paramConfig.maximum !== undefined)
          versionParam.maximum = paramConfig.maximum;
        if (paramConfig.minLength !== undefined)
          versionParam.minLength = paramConfig.minLength;
        if (paramConfig.maxLength !== undefined)
          versionParam.maxLength = paramConfig.maxLength;
        if (paramConfig.pattern) versionParam.pattern = paramConfig.pattern;
        if (paramConfig.default !== undefined)
          versionParam.default = paramConfig.default;

        // 处理数组类型
        if (paramConfig.type === "array" && paramConfig.items) {
          versionParam.items = {
            type: paramConfig.items.type || "string",
          };
          if (paramConfig.items.enum) {
            versionParam.items.enum = paramConfig.items.enum;
          }
          if (paramConfig.items.enumDescriptions) {
            versionParam.items.enumDescriptions =
              paramConfig.items.enumDescriptions;
          }
        }

        // 处理对象类型
        if (paramConfig.type === "object" && paramConfig.properties) {
          versionParam.properties = {};
          Object.entries(paramConfig.properties).forEach(
            ([propName, propConfig]: [string, any]) => {
              const objParam: any = {
                type: propConfig.type,
                description: propConfig.description || "",
              };

              // 复制对象属性的验证规则
              if (propConfig.enum) objParam.enum = propConfig.enum;
              if (propConfig.enumDescriptions)
                objParam.enumDescriptions = propConfig.enumDescriptions;
              if (propConfig.minimum !== undefined)
                objParam.minimum = propConfig.minimum;
              if (propConfig.maximum !== undefined)
                objParam.maximum = propConfig.maximum;
              if (propConfig.minLength !== undefined)
                objParam.minLength = propConfig.minLength;
              if (propConfig.maxLength !== undefined)
                objParam.maxLength = propConfig.maxLength;
              if (propConfig.pattern) objParam.pattern = propConfig.pattern;
              if (propConfig.default !== undefined)
                objParam.default = propConfig.default;

              versionParam.properties[propName] = objParam;
            }
          );
        }

        versionFeature.properties.params.properties[paramName] = versionParam;
      }
    );

    // 添加必填参数
    const requiredParams = Object.entries(feature.paramSchema)
      .filter(([, config]: [string, any]) => config.required)
      .map(([name]) => name);

    if (requiredParams.length > 0) {
      versionFeature.properties.params.required = requiredParams;
    }

    versionFeature.required.push("params");
  }

  // 处理子功能
  if (feature.children && Object.keys(feature.children).length > 0) {
    versionFeature.properties.children = {
      type: "object",
      description: "子功能配置",
      properties: {},
      additionalProperties: false,
    };

    Object.entries(feature.children).forEach(
      ([childName, childFeature]: [string, any]) => {
        versionFeature.properties.children.properties[childName] =
          convertFeatureToVersionFormat(childFeature);
      }
    );
  }

  return versionFeature;
};

/**
 * 生成示例数据
 */
export const generateExampleData = (
  featureSchema: Record<string, FeatureConfig>
): any => {
  const exampleFeatures: any = {};

  Object.entries(featureSchema).forEach(([featureName, feature]) => {
    exampleFeatures[featureName] = {
      enabled: true,
    };

    if (feature.paramSchema && Object.keys(feature.paramSchema).length > 0) {
      exampleFeatures[featureName].params = {};
      Object.entries(feature.paramSchema).forEach(
        ([paramName, paramConfig]: [string, any]) => {
          if (paramConfig.default !== undefined) {
            exampleFeatures[featureName].params[paramName] =
              paramConfig.default;
          }
        }
      );
    }

    // 处理子功能示例
    if (feature.children) {
      exampleFeatures[featureName].children = {};
      Object.entries(feature.children).forEach(
        ([childName, childFeature]: [string, any]) => {
          exampleFeatures[featureName].children[childName] = {
            enabled: true,
          };
          if (
            childFeature.paramSchema &&
            Object.keys(childFeature.paramSchema).length > 0
          ) {
            exampleFeatures[featureName].children[childName].params = {};
            Object.entries(childFeature.paramSchema).forEach(
              ([paramName, paramConfig]: [string, any]) => {
                if (paramConfig.default !== undefined) {
                  exampleFeatures[featureName].children[childName].params[
                    paramName
                  ] = paramConfig.default;
                }
              }
            );
          }
        }
      );
    }
  });

  return exampleFeatures;
};

/**
 * 创建版本配置 Schema
 */
export const createVersionSchema = (
  featureSchema: string | Record<string, FeatureConfig>
): VersionSchema => {
  const baseVersionSchema: VersionSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "版本配置",
    description: "完整的版本配置结构，包含版本信息和具体的功能配置",
    type: "object",
    properties: {
      version: {
        type: "string",
        description: "版本标识符",
        pattern: "^\\d+\\.\\d+\\.\\d+$",
      },
      name: {
        type: "string",
        description: "版本名称",
        minLength: 1,
      },
      description: {
        type: "string",
        description: "版本描述",
        minLength: 1,
      },
      features: {
        type: "object",
        description: "功能配置对象",
        properties: {} as any,
        required: [] as string[],
        additionalProperties: false,
      },
    },
    required: ["version", "name", "description", "features"],
    additionalProperties: false,
  };

  try {
    const parsedFeatureSchema =
      typeof featureSchema === "string"
        ? JSON.parse(featureSchema)
        : featureSchema;

    const features: any = {};
    const requiredFeatures: string[] = [];

    Object.entries(parsedFeatureSchema).forEach(
      ([featureName, feature]: [string, any]) => {
        features[featureName] = convertFeatureToVersionFormat(feature);
        requiredFeatures.push(featureName);
      }
    );

    baseVersionSchema.properties.features.properties = features;
    baseVersionSchema.properties.features.required = requiredFeatures;

    // 添加示例
    const exampleFeatures = generateExampleData(parsedFeatureSchema);
    baseVersionSchema.example = {
      version: "1.0.0",
      name: "基础版本",
      description: "基于功能清单生成的版本配置",
      features: exampleFeatures,
    };

    return baseVersionSchema;
  } catch (error) {
    console.error("解析 featureSchema 失败:", error);
    throw error;
  }
};

/**
 * 将 JSON Schema 转换为 TypeScript 类型定义
 */
export const convertSchemaToTypeScript = (schema: any): string => {
  const interfaces = new Set<string>();

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const generateType = (
    obj: any,
    typeName: string = "",
    depth: number = 0
  ): string => {
    const indent = "  ".repeat(depth);

    // 处理对象类型
    if (obj.type === "object" && obj.properties) {
      const properties = Object.entries(obj.properties)
        .map(([key, value]: [string, any]) => {
          const isOptional = obj.required && !obj.required.includes(key);
          const optional = isOptional ? "?" : "";
          const description = value.description
            ? `${indent}  /** ${value.description} */\n`
            : "";

          // 递归处理嵌套类型
          let propType = generateType(value, "", depth + 1);

          // 处理复杂的嵌套对象，为其生成独立的接口
          if (
            value.type === "object" &&
            value.properties &&
            Object.keys(value.properties).length > 3
          ) {
            const nestedInterfaceName = `${typeName}${capitalize(key)}`;
            const nestedInterface = generateType(value, nestedInterfaceName, 0);
            interfaces.add(nestedInterface);
            propType = nestedInterfaceName;
          }

          return `${description}${indent}  ${key}${optional}: ${propType};`;
        })
        .join("\n");

      if (typeName) {
        return `interface ${typeName} {\n${properties}\n${indent}}`;
      } else {
        return `{\n${properties}\n${indent}}`;
      }
    }

    // 处理数组类型
    if (obj.type === "array") {
      const itemType = obj.items ? generateType(obj.items, "", depth) : "any";
      return `Array<${itemType}>`;
    }

    // 处理枚举类型
    if (obj.enum) {
      if (obj.enum.every((v: any) => typeof v === "string")) {
        return obj.enum.map((value: string) => `"${value}"`).join(" | ");
      } else {
        return obj.enum.map((value: any) => JSON.stringify(value)).join(" | ");
      }
    }

    // 处理基本类型
    switch (obj.type) {
      case "string":
        if (obj.pattern) {
          return `string // Pattern: ${obj.pattern}`;
        }
        return "string";
      case "number":
      case "integer":
        return "number";
      case "boolean":
        return "boolean";
      case "null":
        return "null";
      default:
        return "any";
    }
  };

  // 生成特性相关的接口
  const generateFeatureInterfaces = (
    obj: any,
    prefix: string = ""
  ): string[] => {
    const result: string[] = [];

    if (obj.type === "object" && obj.properties && obj.properties.features) {
      const featuresObj = obj.properties.features;
      if (featuresObj.properties) {
        Object.entries(featuresObj.properties).forEach(
          ([featureName, feature]: [string, any]) => {
            const interfaceName = `${prefix}${capitalize(featureName)}Feature`;
            const interfaceCode = generateType(feature, interfaceName, 0);
            result.push(interfaceCode);

            // 递归处理子功能
            if (feature.properties && feature.properties.children) {
              const childrenObj = feature.properties.children;
              if (childrenObj.properties) {
                Object.entries(childrenObj.properties).forEach(
                  ([childName, child]: [string, any]) => {
                    const childInterfaceName = `${prefix}${capitalize(
                      featureName
                    )}${capitalize(childName)}Feature`;
                    const childInterfaceCode = generateType(
                      child,
                      childInterfaceName,
                      0
                    );
                    result.push(childInterfaceCode);
                  }
                );
              }
            }
          }
        );
      }
    }

    return result;
  };

  // 生成主接口
  const mainInterface = generateType(schema, "VersionConfig", 0);

  // 生成特性接口
  const featureInterfaces = generateFeatureInterfaces(schema);

  // 生成通用类型
  const commonTypes = `
/** 功能启用状态 */
type FeatureEnabled = boolean;

/** 功能参数配置 */
interface FeatureParams {
  [key: string]: any;
}

/** 基础功能配置 */
interface BaseFeature {
  /** 是否启用此功能 */
  enabled: FeatureEnabled;
  /** 功能参数配置 */
  params?: FeatureParams;
}`;

  // 组合所有类型定义
  const allTypes = [
    `// 基于功能清单动态生成的 TypeScript 类型定义`,
    `// 生成时间: ${new Date().toLocaleString()}`,
    `// Schema Title: ${schema.title || "Version Configuration"}`,
    `// Schema Description: ${
      schema.description || "Auto-generated type definitions"
    }`,
    "",
    commonTypes,
    "",
    ...Array.from(interfaces),
    ...featureInterfaces,
    "",
    mainInterface,
    "",
    "// 导出主要类型",
    "export type { VersionConfig, BaseFeature, FeatureParams, FeatureEnabled };",
    "",
    "// 默认导出",
    "export default VersionConfig;",
  ];

  return allTypes.join("\n");
};
