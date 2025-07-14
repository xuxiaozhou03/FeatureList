const getParams = (paramsConfig: any) => {
  return Object.entries(paramsConfig || {}).reduce((acc, [key, param]) => {
    const { defaultValue } = param as any;

    let value = defaultValue;
    if (defaultValue === undefined) {
      // 尝试从类型中获取值
    }

    acc[key] = value;
    return acc;
  }, {} as any);
};
const getFeatures = (features: any) => {
  return Object.entries(features).reduce((acc, [key, node]) => {
    const { title, description, params, type, ...children } = node as any;

    acc[key] = {
      enabled: true,
      params: getParams(params),
      ...getFeatures(children),
    };

    return acc;
  }, {} as any);
};

export const getVersionDefaultConfig = (features: any) => {
  const defaultVersionConfig = {
    name: "enterprise",
    description: "企业版功能清单",
    features: getFeatures(features),
  };
  return defaultVersionConfig;
};
