import { useFeatureEnabled, useFeatureParams, useFeatures } from "../../hooks";

// 测试版本配置hooks的功能
const TestVersionHooks = () => {
  console.log("=== 版本配置测试 ===");

  // 测试获取当前版本
  const { version, setVersion, versionConfig, features } = useFeatures();
  console.log("当前版本:", version);

  console.log("版本配置:", versionConfig);

  // 测试功能启用状态 - 直接访问 features 对象获得类型提示
  const dashboardEnabled = features.dashboard?.enabled;
  const projectsEnabled = features.projects?.enabled;
  const pipelinesEnabled = features.projects?.children?.pipelines?.enabled;

  console.log("Dashboard 启用:", dashboardEnabled);
  console.log("Projects 启用:", projectsEnabled);
  console.log("Pipelines 启用:", pipelinesEnabled);

  // 测试功能参数 - 直接访问 features 对象获得类型提示
  const dashboardParams = features.dashboard?.params;
  const projectsParams = features.projects?.params;
  const pipelinesParams = features.projects?.children?.pipelines?.params;

  console.log("Dashboard 参数:", dashboardParams);
  console.log("Projects 参数:", projectsParams);
  console.log("Pipelines 参数:", pipelinesParams);

  // 对比测试 - 使用字符串路径的方式
  const dashboardEnabledByPath = useFeatureEnabled("dashboard");
  const projectsEnabledByPath = useFeatureEnabled("projects");
  const pipelinesEnabledByPath = useFeatureEnabled("projects.pipelines");

  const dashboardParamsByPath = useFeatureParams("dashboard");
  const projectsParamsByPath = useFeatureParams("projects");
  const pipelinesParamsByPath = useFeatureParams("projects.pipelines");

  console.log("=== 对比测试 ===");
  console.log("直接访问 vs 路径访问:");
  console.log(
    "Dashboard enabled:",
    dashboardEnabled,
    "vs",
    dashboardEnabledByPath
  );
  console.log(
    "Projects enabled:",
    projectsEnabled,
    "vs",
    projectsEnabledByPath
  );
  console.log(
    "Pipelines enabled:",
    pipelinesEnabled,
    "vs",
    pipelinesEnabledByPath
  );
  console.log(
    "Dashboard params:",
    dashboardParams,
    "vs",
    dashboardParamsByPath
  );
  console.log("Projects params:", projectsParams, "vs", projectsParamsByPath);
  console.log(
    "Pipelines params:",
    pipelinesParams,
    "vs",
    pipelinesParamsByPath
  );

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">版本配置测试结果</h3>

      {/* 版本切换控件 */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h4 className="font-semibold mb-2">版本切换:</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setVersion("enterprise")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              version === "enterprise"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
            }`}
          >
            Enterprise
          </button>
          <button
            onClick={() => setVersion("community")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              version === "community"
                ? "bg-green-500 text-white"
                : "bg-white text-green-500 border border-green-500 hover:bg-green-50"
            }`}
          >
            Community
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <p>当前版本: {version}</p>
        <p>版本名称: {versionConfig?.name}</p>
        <p>版本描述: {versionConfig?.description}</p>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">
            直接访问 features 对象 (有类型提示):
          </h4>
          <p>Dashboard: {dashboardEnabled ? "✅ 启用" : "❌ 禁用"}</p>
          <p>Projects: {projectsEnabled ? "✅ 启用" : "❌ 禁用"}</p>
          <p>Pipelines: {pipelinesEnabled ? "✅ 启用" : "❌ 禁用"}</p>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">
            使用字符串路径访问 (hook 方式):
          </h4>
          <p>Dashboard: {dashboardEnabledByPath ? "✅ 启用" : "❌ 禁用"}</p>
          <p>Projects: {projectsEnabledByPath ? "✅ 启用" : "❌ 禁用"}</p>
          <p>Pipelines: {pipelinesEnabledByPath ? "✅ 启用" : "❌ 禁用"}</p>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">参数对比:</h4>
          <p>Dashboard Layout (直接): {dashboardParams?.layout}</p>
          <p>Dashboard Layout (路径): {dashboardParamsByPath?.layout}</p>
          <p>Projects Max (直接): {projectsParams?.maxProjects}</p>
          <p>Projects Max (路径): {projectsParamsByPath?.maxProjects}</p>
          <p>Pipelines Max (直接): {pipelinesParams?.maxPipelines}</p>
          <p>Pipelines Max (路径): {pipelinesParamsByPath?.maxPipelines}</p>
        </div>
      </div>
    </div>
  );
};

export default TestVersionHooks;
