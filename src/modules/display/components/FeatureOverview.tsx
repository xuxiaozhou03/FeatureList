import { useFeatures } from "../../hooks";
import { useState } from "react";

const FeatureOverview = () => {
  const { features, versionConfig } = useFeatures();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // 获取所有功能的启用状态
  const getFeatureStatus = (features: any, prefix = "") => {
    const result: Array<{
      name: string;
      enabled: boolean;
      path: string;
      params?: any;
      children?: any;
    }> = [];

    Object.entries(features).forEach(([key, feature]: [string, any]) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      result.push({
        name: key,
        enabled: feature.enabled,
        path: fullPath,
        params: feature.params,
        children: feature.children,
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

  const getFeatureIcon = (featureName: string) => {
    const icons: { [key: string]: string } = {
      dashboard: "📊",
      projects: "📁",
      pipelines: "🔄",
      security: "🔒",
      analytics: "📈",
      users: "👥",
      settings: "⚙️",
      reports: "📋",
      notifications: "🔔",
      integrations: "🔗",
    };
    return icons[featureName] || "📦";
  };

  const handleFeatureClick = (feature: any) => {
    setSelectedFeature(selectedFeature === feature.path ? null : feature.path);
  };

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">功能状态概览</h2>
            <p className="text-gray-600 mt-1">当前版本: {versionConfig.name}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">
              {enabledCount}
            </div>
            <div className="text-sm text-gray-500">/ {totalCount} 功能启用</div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>功能启用率</span>
            <span className="font-medium">
              {Math.round((enabledCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(enabledCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {enabledCount}
                </div>
                <div className="text-sm text-green-700">启用功能</div>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {totalCount - enabledCount}
                </div>
                <div className="text-sm text-red-700">禁用功能</div>
              </div>
              <div className="text-3xl">❌</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((enabledCount / totalCount) * 100)}%
                </div>
                <div className="text-sm text-blue-700">覆盖率</div>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能列表 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">详细功能列表</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureStatuses.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                feature.enabled
                  ? "border-green-200 bg-green-50 hover:bg-green-100"
                  : "border-red-200 bg-red-50 hover:bg-red-100"
              } ${
                selectedFeature === feature.path
                  ? "ring-2 ring-indigo-500 transform scale-105"
                  : "hover:transform hover:scale-102"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getFeatureIcon(feature.name)}
                  </span>
                  <span className="font-medium text-gray-900">
                    {feature.name}
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    feature.enabled ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mb-2">{feature.path}</div>
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  feature.enabled
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {feature.enabled ? "已启用" : "已禁用"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 功能详情 */}
      {selectedFeature && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            功能详情:{" "}
            {featureStatuses.find((f) => f.path === selectedFeature)?.name}
          </h3>
          <div className="space-y-4">
            {(() => {
              const feature = featureStatuses.find(
                (f) => f.path === selectedFeature
              );
              if (!feature) return null;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      基本信息
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">功能名称:</span>
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">功能路径:</span>
                        <span className="font-mono text-sm">
                          {feature.path}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">启用状态:</span>
                        <span
                          className={`font-medium ${
                            feature.enabled ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {feature.enabled ? "已启用" : "已禁用"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      配置参数
                    </h4>
                    {feature.params ? (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-sm text-gray-700 overflow-x-auto">
                          {JSON.stringify(feature.params, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">无配置参数</div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureOverview;
