import { useState } from "react";
import VersionDisplay from "./components/VersionDisplay";
import FeatureOverview from "./components/FeatureOverview";
import DeveloperDocs from "./components/DeveloperDocs";
import TestVersionHooks from "./components/TestVersionHooks";
import { useFeatures } from "../hooks";

const DisplayPage = () => {
  const [selectedView, setSelectedView] = useState<
    "overview" | "version" | "docs" | "test"
  >("overview");
  const { version, setVersion, versionConfig } = useFeatures();

  const toggleVersion = () => {
    setVersion(version === "community" ? "enterprise" : "community");
  };

  const views = [
    { id: "overview", name: "功能概览", icon: "📊" },
    { id: "version", name: "版本信息", icon: "📦" },
    { id: "docs", name: "开发文档", icon: "📚" },
    { id: "test", name: "测试控制台", icon: "🧪" },
  ];

  const renderSelectedView = () => {
    switch (selectedView) {
      case "overview":
        return <FeatureOverview />;
      case "version":
        return <VersionDisplay />;
      case "docs":
        return <DeveloperDocs />;
      case "test":
        return <TestVersionHooks />;
      default:
        return <FeatureOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                版本配置展示
              </h1>
              <p className="text-sm text-gray-600">
                通过环境变量 __VERSION__ 进行版本配置管理
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">当前版本:</span>
              <button
                onClick={toggleVersion}
                className={`relative inline-flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  version === "community"
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                }`}
              >
                {version === "community" ? "社区版" : "企业版"}
                <span className="ml-2 text-xs opacity-75">
                  {versionConfig.version}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    version === "community" ? "bg-green-400" : "bg-purple-400"
                  }`}
                ></div>
                <span className="font-medium">
                  {versionConfig.name} - {versionConfig.description}
                </span>
              </div>
              <span className="text-sm opacity-75">
                版本 {versionConfig.version}
              </span>
            </div>
            <button
              onClick={toggleVersion}
              className="px-4 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm font-medium transition-all duration-300"
            >
              切换到{version === "community" ? "企业版" : "社区版"}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                  selectedView === view.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="text-lg">{view.icon}</span>
                <span>{view.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="transition-all duration-500 ease-in-out">
          {renderSelectedView()}
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
