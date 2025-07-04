import { useState } from "react";

const Test = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const enterpriseFeatures = [
    {
      id: "dashboard",
      name: "高级仪表板",
      description: "实时数据监控和可视化",
      premium: true,
      icon: "📊",
    },
    {
      id: "projects",
      name: "项目管理",
      description: "无限项目创建和管理",
      premium: true,
      icon: "📁",
    },
    {
      id: "pipelines",
      name: "CI/CD 流水线",
      description: "自动化构建和部署",
      premium: true,
      icon: "🔄",
    },
    {
      id: "security",
      name: "安全审计",
      description: "高级安全扫描和合规检查",
      premium: true,
      icon: "🔒",
    },
    {
      id: "analytics",
      name: "深度分析",
      description: "详细的使用统计和性能分析",
      premium: true,
      icon: "📈",
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                企业版功能展示
              </h1>
              <p className="text-gray-600">体验完整的企业级功能和高级交互</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
                Enterprise v1.0.1
              </span>
              <button
                onClick={toggleAdvancedMode}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isAdvancedMode
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isAdvancedMode ? "标准模式" : "高级模式"}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {enterpriseFeatures.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                selectedFeature === feature.id
                  ? "ring-2 ring-indigo-500 bg-indigo-50"
                  : ""
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded">
                    PREMIUM
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>

                {isAdvancedMode && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">状态:</span>
                      <span className="text-green-600 font-medium">已启用</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">使用率:</span>
                      <span className="text-blue-600 font-medium">
                        {Math.floor(Math.random() * 50 + 50)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{
                          width: `${Math.floor(Math.random() * 50 + 50)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Feature Details */}
        {selectedFeature && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              功能详情:{" "}
              {enterpriseFeatures.find((f) => f.id === selectedFeature)?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  配置选项
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">自动刷新</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">高级权限</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">数据导出</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  实时监控
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">CPU 使用率</span>
                    <span className="text-2xl font-bold text-green-600">
                      {Math.floor(Math.random() * 30 + 20)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">内存使用</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {Math.floor(Math.random() * 40 + 30)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">活跃用户</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {Math.floor(Math.random() * 500 + 100)}
                    </span>
                  </div>
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
