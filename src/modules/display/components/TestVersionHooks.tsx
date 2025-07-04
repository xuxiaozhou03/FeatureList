import { useFeatureEnabled, useFeatureParams, useFeatures } from "../../hooks";
import { useState } from "react";

// 测试版本配置hooks的功能
const TestVersionHooks = () => {
  const [showConsole, setShowConsole] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

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

  const runTest = () => {
    const results: string[] = [];
    results.push(`测试时间: ${new Date().toLocaleTimeString()}`);
    results.push(`当前版本: ${version}`);
    results.push(`版本名称: ${versionConfig?.name}`);
    results.push(`Dashboard (直接): ${dashboardEnabled ? "✅" : "❌"}`);
    results.push(`Dashboard (路径): ${dashboardEnabledByPath ? "✅" : "❌"}`);
    results.push(`Projects (直接): ${projectsEnabled ? "✅" : "❌"}`);
    results.push(`Projects (路径): ${projectsEnabledByPath ? "✅" : "❌"}`);
    results.push(`Pipelines (直接): ${pipelinesEnabled ? "✅" : "❌"}`);
    results.push(`Pipelines (路径): ${pipelinesEnabledByPath ? "✅" : "❌"}`);
    results.push("--- 测试完成 ---");

    setTestResults((prev) => [...results, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testItems = [
    {
      title: "功能启用状态",
      tests: [
        {
          name: "Dashboard",
          direct: dashboardEnabled,
          path: dashboardEnabledByPath,
        },
        {
          name: "Projects",
          direct: projectsEnabled,
          path: projectsEnabledByPath,
        },
        {
          name: "Pipelines",
          direct: pipelinesEnabled,
          path: pipelinesEnabledByPath,
        },
      ],
    },
    {
      title: "功能参数配置",
      tests: [
        {
          name: "Dashboard Layout",
          direct: dashboardParams?.layout,
          path: dashboardParamsByPath?.layout,
        },
        {
          name: "Projects Max",
          direct: projectsParams?.maxProjects,
          path: projectsParamsByPath?.maxProjects,
        },
        {
          name: "Pipelines Max",
          direct: pipelinesParams?.maxPipelines,
          path: pipelinesParamsByPath?.maxPipelines,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 控制台面板 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">测试控制台</h2>
            <p className="text-gray-600 mt-1">Hook 功能测试和对比验证</p>
          </div>
          <div className="text-4xl">🧪</div>
        </div>

        {/* 版本信息 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">当前版本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-3 rounded">
              <div className="text-blue-600 text-sm font-medium">版本</div>
              <div className="text-blue-900 font-bold">{version}</div>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <div className="text-blue-600 text-sm font-medium">名称</div>
              <div className="text-blue-900 font-bold">
                {versionConfig?.name}
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <div className="text-blue-600 text-sm font-medium">版本号</div>
              <div className="text-blue-900 font-bold">
                {versionConfig?.version}
              </div>
            </div>
          </div>
        </div>

        {/* 版本切换 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 mb-6">
          <h3 className="font-semibold text-purple-900 mb-3">版本切换测试</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setVersion("enterprise")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                version === "enterprise"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-50"
              }`}
            >
              🏢 Enterprise
            </button>
            <button
              onClick={() => setVersion("community")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                version === "community"
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg"
                  : "bg-white text-green-600 border border-green-300 hover:bg-green-50"
              }`}
            >
              👥 Community
            </button>
          </div>
        </div>

        {/* 测试控制 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-3">测试控制</h3>
          <div className="flex gap-3">
            <button
              onClick={runTest}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              🚀 运行测试
            </button>
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showConsole ? "隐藏" : "显示"} 控制台
            </button>
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              清空结果
            </button>
          </div>
        </div>
      </div>

      {/* 测试结果对比 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Hook 对比测试</h3>

        <div className="space-y-6">
          {testItems.map((category, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-4">
                {category.title}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">功能</th>
                      <th className="text-left p-2">直接访问</th>
                      <th className="text-left p-2">Hook 访问</th>
                      <th className="text-left p-2">匹配状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.tests.map((test, testIndex) => (
                      <tr key={testIndex} className="border-b">
                        <td className="p-2 font-medium">{test.name}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              typeof test.direct === "boolean"
                                ? test.direct
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {typeof test.direct === "boolean"
                              ? test.direct
                                ? "✅ 启用"
                                : "❌ 禁用"
                              : test.direct || "N/A"}
                          </span>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              typeof test.path === "boolean"
                                ? test.path
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {typeof test.path === "boolean"
                              ? test.path
                                ? "✅ 启用"
                                : "❌ 禁用"
                              : test.path || "N/A"}
                          </span>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              test.direct === test.path
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {test.direct === test.path
                              ? "✅ 一致"
                              : "❌ 不一致"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 控制台输出 */}
      {showConsole && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">控制台输出</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            ) : (
              <div className="text-gray-500">
                没有测试结果，点击"运行测试"开始测试...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestVersionHooks;
