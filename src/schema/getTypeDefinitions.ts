export const getFeatureDefinitions = (features: any) => {
  return Object.entries(features).reduce((acc, [key, node]) => {
    const { title } = node as any;
    acc += `
    // ${title || key}
    ${key}: {
      // 是否启用
      enabled: boolean;
    };`;
    return acc;
  }, "");
};

const getTypeDefinitions = (versionSchema: any) => {
  console.log(versionSchema);
  return `export type IVersion {
  // 版本名称
  name: string;
  // 版本描述
  description?: string;
  // 功能清单
  features: {
    ${getFeatureDefinitions(versionSchema.properties.features.properties)}
  } 
}`;
};

export default getTypeDefinitions;
