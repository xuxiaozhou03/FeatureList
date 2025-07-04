import VersionDisplay from "./components/VersionDisplay";
import FeatureOverview from "./components/FeatureOverview";
import DeveloperDocs from "./components/DeveloperDocs";
import TestVersionHooks from "./components/TestVersionHooks";

const DisplayPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">版本配置展示</h1>
        <p className="text-gray-600">
          通过环境变量 __VERSION__ 进行版本配置管理
        </p>
      </div>

      {/* 测试组件 */}
      <TestVersionHooks />

      {/* 功能状态概览 */}
      <FeatureOverview />

      {/* 版本信息展示 */}
      <VersionDisplay />

      {/* 开发者文档 */}
      <DeveloperDocs />
    </div>
  );
};

export default DisplayPage;
