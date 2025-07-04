import { useState } from "react";

const Test = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const communityFeatures = [
    {
      id: "dashboard",
      name: "基础仪表板",
      description: "基本的项目概览和统计",
      available: true,
      icon: "📊",
    },
    {
      id: "projects",
      name: "项目管理",
      description: "最多100个项目",
      available: true,
      icon: "📁",
    },
    {
      id: "pipelines",
      name: "CI/CD 流水线",
      description: "升级到企业版解锁",
      available: false,
      icon: "🔄",
    },
    {
      id: "security",
      name: "安全审计",
      description: "升级到企业版解锁",
      available: false,
      icon: "🔒",
    },
    {
      id: "analytics",
      name: "深度分析",
      description: "升级到企业版解锁",
      available: false,
      icon: "📈",
    },
  ];

  const handleFeatureClick = (featureId: string, available: boolean) => {
    if (available) {
      setSelectedFeature(featureId);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                社区版功能展示
              </h1>
              <p className="text-gray-600">
                体验基础功能，升级解锁更多高级特性
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-sm font-medium">
                Community v1.0.0
              </span>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                升级到企业版
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {communityFeatures.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id, feature.available)}
              className={`bg-white rounded-lg shadow-md transition-all duration-300 cursor-pointer ${
                feature.available
                  ? "hover:shadow-lg transform hover:-translate-y-1"
                  : "opacity-75 cursor-not-allowed"
              } ${
                selectedFeature === feature.id && feature.available
                  ? "ring-2 ring-green-500 bg-green-50"
                  : ""
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                  {feature.available ? (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                      免费
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-400 text-white text-xs font-bold rounded">
                      锁定
                    </span>
                  )}
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    feature.available ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {feature.name}
                </h3>
                <p
                  className={`mb-4 ${
                    feature.available ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {feature.description}
                </p>

                {feature.available && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">状态:</span>
                    <span className="text-green-600 font-medium">可用</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Feature Details */}
        {selectedFeature && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              功能详情:{" "}
              {communityFeatures.find((f) => f.id === selectedFeature)?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  基础配置
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">基础功能</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-green-600"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg opacity-50">
                    <span className="text-gray-500">高级权限</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-gray-400"
                      disabled
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg opacity-50">
                    <span className="text-gray-500">数据导出</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-gray-400"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  基础统计
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">项目数量</span>
                    <span className="text-2xl font-bold text-green-600">
                      {Math.floor(Math.random() * 50 + 10)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">今日访问</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.floor(Math.random() * 100 + 50)}
                    </span>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-orange-800 text-sm">
                      💡 升级到企业版，解锁更多详细统计和实时监控功能
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  升级到企业版
                </h2>
                <p className="text-gray-600 mb-6">
                  解锁所有高级功能，包括 CI/CD 流水线、安全审计、深度分析等
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">✅ 无限项目</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">✅ 高级安全</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">✅ 实时监控</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">✅ 24/7 支持</span>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={closeUpgradeModal}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    稍后再说
                  </button>
                  <button
                    onClick={closeUpgradeModal}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    立即升级
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
