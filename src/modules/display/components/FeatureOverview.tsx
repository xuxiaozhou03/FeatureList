import { useFeatures } from "../../hooks";

const FeatureOverview = () => {
  const { features } = useFeatures();

  // 获取所有功能的启用状态
  const getFeatureStatus = (features: any, prefix = "") => {
    const result: Array<{ name: string; enabled: boolean; path: string }> = [];

    Object.entries(features).forEach(([key, feature]: [string, any]) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      result.push({
        name: key,
        enabled: feature.enabled,
        path: fullPath,
      });

      if (feature.children) {
        result.push(...getFeatureStatus(feature.children, fullPath));
      }
    });

    return result;
  };

  const featureStatuses = getFeatureStatus(features);
  const enabledCount = featureStatuses.filter((f) => f.enabled).length;
  const totalCount = featureStatuses.length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">功能状态概览</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-green-600">{enabledCount}</span> /{" "}
          {totalCount} 个功能启用
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>功能启用率</span>
          <span>{Math.round((enabledCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(enabledCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 功能列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {featureStatuses.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                feature.enabled ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm font-medium">{feature.name}</span>
            <span className="text-xs text-gray-500 ml-auto">
              {feature.path}
            </span>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-50 p-3 rounded">
            <div className="text-2xl font-bold text-green-600">
              {enabledCount}
            </div>
            <div className="text-sm text-green-700">启用功能</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="text-2xl font-bold text-red-600">
              {totalCount - enabledCount}
            </div>
            <div className="text-sm text-red-700">禁用功能</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureOverview;
