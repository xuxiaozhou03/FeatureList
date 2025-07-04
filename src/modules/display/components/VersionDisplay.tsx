import { useFeatures } from "../../hooks";

const VersionDisplay = () => {
  const { version, versionConfig, features } = useFeatures();

  const renderFeature = (name: string, feature: any, level = 0) => {
    const indent = "  ".repeat(level);

    return (
      <div key={name} className="mb-4">
        <div
          className={`flex items-center gap-2 font-medium ${
            level > 0 ? "text-sm" : "text-base"
          }`}
        >
          <span>
            {indent}📦 {name}
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${
              feature.enabled
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {feature.enabled ? "启用" : "禁用"}
          </span>
        </div>

        {feature.params && (
          <div
            className={`mt-2 p-3 bg-gray-50 rounded ${level > 0 ? "ml-4" : ""}`}
          >
            <div className="text-sm font-medium text-gray-700 mb-2">
              参数配置：
            </div>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(feature.params, null, 2)}
            </pre>
          </div>
        )}

        {feature.children && (
          <div className={`mt-2 ${level > 0 ? "ml-4" : ""}`}>
            {Object.entries(feature.children).map(([childName, childFeature]) =>
              renderFeature(childName, childFeature, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 版本信息卡片 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">版本信息</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">当前版本</h3>
            <p className="text-blue-700 text-lg font-semibold">{version}</p>
            <p className="text-blue-600 text-sm">来源：环境变量 __VERSION__</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900">版本详情</h3>
            <p className="text-green-700 font-semibold">
              {versionConfig?.name}
            </p>
            <p className="text-green-600 text-sm">
              {versionConfig?.description}
            </p>
            <p className="text-green-600 text-xs">v{versionConfig?.version}</p>
          </div>
        </div>
      </div>

      {/* 功能配置详情 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">功能配置详情</h2>

        <div className="space-y-4">
          {Object.entries(features).map(([featureName, feature]) =>
            renderFeature(featureName, feature)
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionDisplay;
