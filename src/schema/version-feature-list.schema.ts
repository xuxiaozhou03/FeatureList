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
        enabled: {
          type: "boolean",
          title: "是否启用",
          description: "该功能是否启用",
          default: true,
        },
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
    $schema: "http://json-schema.org/draft-07/schema#",
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
    required: ["name", "features"],
    additionalProperties: false,
  };
}

export { generateVersionFeatureListSchema };
