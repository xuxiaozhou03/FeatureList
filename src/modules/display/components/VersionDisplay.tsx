import { useFeatures } from "../../hooks";
import { useState } from "react";

const VersionDisplay = () => {
  const { version, versionConfig, features } = useFeatures();
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(
    new Set()
  );

  const toggleFeature = (featurePath: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featurePath)) {
      newExpanded.delete(featurePath);
    } else {
      newExpanded.add(featurePath);
    }
    setExpandedFeatures(newExpanded);
  };

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

  const renderFeature = (
    name: string,
    feature: any,
    level = 0,
    parentPath = ""
  ) => {
    const currentPath = parentPath ? `${parentPath}.${name}` : name;
    const isExpanded = expandedFeatures.has(currentPath);
    const hasChildren =
      feature.children && Object.keys(feature.children).length > 0;
    const hasParams = feature.params && Object.keys(feature.params).length > 0;

    return (
      <div key={currentPath} className={`${level > 0 ? "ml-6" : ""}`}>
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
            feature.enabled
              ? "border-green-200 bg-green-50 hover:bg-green-100"
              : "border-red-200 bg-red-50 hover:bg-red-100"
          } ${isExpanded ? "ring-2 ring-indigo-500" : ""}`}
          onClick={() => toggleFeature(currentPath)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFeatureIcon(name)}</span>
              <div>
                <h3
                  className={`font-semibold ${
                    level === 0 ? "text-lg" : "text-base"
                  } ${feature.enabled ? "text-gray-900" : "text-gray-600"}`}
                >
                  {name}
                </h3>
                <p className="text-xs text-gray-500">{currentPath}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  feature.enabled
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {feature.enabled ? "启用" : "禁用"}
              </span>
              {(hasChildren || hasParams) && (
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* 展开的详细信息 */}
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {hasParams && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    参数配置
                  </h4>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <pre className="text-xs text-gray-700 overflow-x-auto">
                      {JSON.stringify(feature.params, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {hasChildren && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    子功能
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(feature.children).map(
                      ([childName, childFeature]) =>
                        renderFeature(
                          childName,
                          childFeature,
                          level + 1,
                          currentPath
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 版本信息卡片 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">版本信息</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900">当前版本</h3>
              <span className="text-3xl">🏷️</span>
            </div>
            <p className="text-blue-700 text-2xl font-bold mb-2">{version}</p>
            <p className="text-blue-600 text-sm">来源: 环境变量 __VERSION__</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-900">版本详情</h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-green-700 text-xl font-bold mb-2">
              {versionConfig?.name}
            </p>
            <p className="text-green-600 text-sm mb-2">
              {versionConfig?.description}
            </p>
            <p className="text-green-600 text-xs font-mono">
              v{versionConfig?.version}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-purple-900">功能统计</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-purple-700 text-2xl font-bold mb-2">
              {Object.values(features).filter((f: any) => f.enabled).length}
            </p>
            <p className="text-purple-600 text-sm">
              / {Object.keys(features).length} 功能启用
            </p>
          </div>
        </div>
      </div>

      {/* 功能配置详情 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">功能配置详情</h2>
          <button
            onClick={() => {
              if (expandedFeatures.size > 0) {
                setExpandedFeatures(new Set());
              } else {
                setExpandedFeatures(new Set(Object.keys(features)));
              }
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            {expandedFeatures.size > 0 ? "收起所有" : "展开所有"}
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(features).map(([featureName, feature]) =>
            renderFeature(featureName, feature)
          )}
        </div>
      </div>

      {/* 版本配置 JSON */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">完整配置</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify({ version, versionConfig, features }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default VersionDisplay;
