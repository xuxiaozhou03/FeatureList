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
