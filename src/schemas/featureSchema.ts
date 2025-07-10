// 定义功能清单的规范示例（您期望的格式）
export const FEATURE_DEFINITION_EXAMPLE = {
  // 功能点：搜索引擎
  searchEngine: {
    // 功能点标题
    title: "搜索引擎",
    // 功能点描述，可选
    description: "商品搜索功能模块",
    // 功能点参数定义
    paramsSchema: {
      // 参数配置
      // 参数名：索引更新间隔
      indexingInterval: {
        // 参数类型：整数
        // 完整参数类型有：string, number, boolean, object, array
        type: "number",
        // 参数描述（可选）
        description: "索引更新间隔（分钟）",
        // 默认值（可选）
        default: 30,
        // 最小值（可选）
        minimum: 5,
        // 最大值（可选）
        maximum: 1440,
      },
    },
    // 子功能A：基础搜索
    basicSearch: {
      title: "基础搜索",
      description: "基本的关键词搜索功能",
      paramsSchema: {
        maxResults: {
          type: "number",
          description: "最大搜索结果数",
          default: 50,
          minimum: 10,
          maximum: 200,
        },
        enableFuzzySearch: {
          type: "boolean",
          description: "是否启用模糊搜索",
          default: true,
        },
      },
    },
    // 子功能B：高级搜索
    advancedSearch: {
      title: "高级搜索",
      description: "支持过滤器和排序的高级搜索",
      paramsSchema: {
        enableFilters: {
          type: "boolean",
          description: "是否启用过滤器",
          default: true,
        },
        sortBy: {
          type: "string",
          description: "排序方式",
          enum: ["price", "rating", "popularity", "date"],
          enum_description: [
            "按价格排序",
            "按评分排序",
            "按热度排序",
            "按时间排序",
          ],
          default: "popularity",
        },
      },
      // 子功能的子功能：价格过滤器
      priceFilter: {
        title: "价格过滤器",
        description: "价格范围过滤功能",
        paramsSchema: {
          minPrice: {
            type: "number",
            description: "最小价格",
            default: 0,
            minimum: 0,
          },
          maxPrice: {
            type: "number",
            description: "最大价格",
            default: 99999,
            minimum: 1,
          },
        },
      },
    },
  },
};

// 功能定义的 JSON Schema（用于 Monaco Editor 约束）
export const FEATURE_DEFINITION_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "功能定义清单",
  description: "定义功能清单的结构和参数约束",
  type: "object",
  patternProperties: {
    "^[a-zA-Z][a-zA-Z0-9_-]*$": {
      $ref: "#/$defs/FeatureDefinition",
    },
  },
  additionalProperties: false,
  $defs: {
    FeatureDefinition: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "功能显示名称",
          minLength: 1,
          maxLength: 100,
        },
        description: {
          type: "string",
          description: "功能详细描述",
          maxLength: 500,
        },
        paramsSchema: {
          type: "object",
          description: "参数Schema定义",
          patternProperties: {
            "^[a-zA-Z][a-zA-Z0-9_-]*$": {
              $ref: "#/$defs/ParameterDefinition",
            },
          },
          additionalProperties: false,
        },
      },
      required: ["title"],
      additionalProperties: {
        $ref: "#/$defs/FeatureDefinition",
      },
    },
    ParameterDefinition: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["string", "number", "number", "boolean"],
          description: "类型",
        },
        description: {
          type: "string",
          description: "描述",
        },
        default: {
          description: "默认值",
        },
        enum: {
          type: "array",
          description: "枚举值",
          items: {
            oneOf: [{ type: "string" }, { type: "number" }],
          },
        },
        enum_description: {
          type: "array",
          description: "枚举项解释说明",
          items: {
            type: "string",
          },
        },
        minimum: {
          type: "number",
          description: "最小值（数字类型）",
        },
        maximum: {
          type: "number",
          description: "最大值（数字类型）",
        },
        minLength: {
          type: "number",
          description: "最小长度（字符串类型）",
        },
        maxLength: {
          type: "number",
          description: "最大长度（字符串类型）",
        },
        pattern: {
          type: "string",
          description: "正则表达式模式（字符串类型）",
        },
        minItems: {
          type: "number",
          description: "数组最小项数",
        },
        maxItems: {
          type: "number",
          description: "数组最大项数",
        },
        uniqueItems: {
          type: "boolean",
          description: "数组项是否唯一",
        },
      },
      required: ["type"],
      additionalProperties: false,
    },
  },
};

const properties =
  FEATURE_DEFINITION_SCHEMA.$defs.ParameterDefinition.properties;
export const ParameterDefinitionMap = Object.entries(properties).reduce(
  (acc, [key, value]) => {
    acc[key] = value.description || "";
    return acc;
  },
  {} as Record<string, string>
);

// 空的功能定义模板
export const EMPTY_FEATURE_DEFINITION = {
  exampleFeature: {
    title: "示例功能",
    description: "这是一个示例功能定义",
    paramsSchema: {
      enabled: {
        type: "boolean",
        description: "是否启用",
        default: true,
      },
      config: {
        type: "string",
        description: "配置参数",
        default: "default-config",
      },
    },
  },
};

// 企业版功能定义示例
export const VERSION_SCHEMA = {
  name: "enterprise",
  description: "企业版",
  features: {
    searchEngine: {
      enabled: true,
      params: {
        indexingInterval: 30,
      },
      basicSearch: {
        enabled: true,
      },
    },
  },
};

export interface Version_Example {
  name: string;
  description: string;
  features: {
    searchEngine: {
      enabled: boolean;
      params: {
        indexingInterval: number;
      };
      basicSearch: {
        enabled: boolean;
      };
    };
  };
}
