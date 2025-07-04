import { useState } from "react";

const DeveloperDocs = () => {
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  const codeExamples = [
    {
      title: "获取当前版本和配置",
      description: "通过 useFeatures 获取当前版本和完整配置信息",
      category: "基础用法",
      code: `import { useFeatures } from '../hooks';

const MyComponent = () => {
  const { version, setVersion, versionConfig, features } = useFeatures();
  
  return (
    <div>
      <h3>{versionConfig.name}</h3>
      <p>{versionConfig.description}</p>
      <p>当前版本: {version}</p>
      <p>版本号: {versionConfig.version}</p>
    </div>
  );
};`,
    },
    {
      title: "动态切换版本",
      description: "使用 setVersion 动态切换版本配置",
      category: "版本管理",
      code: `import { useFeatures } from '../hooks';

const VersionSwitcher = () => {
  const { version, setVersion, versionConfig } = useFeatures();
  
  return (
    <div>
      <h3>当前版本: {version}</h3>
      <p>{versionConfig.name}</p>
      
      <div>
        <button onClick={() => setVersion('enterprise')}>
          切换到 Enterprise
        </button>
        <button onClick={() => setVersion('community')}>
          切换到 Community
        </button>
      </div>
    </div>
  );
};`,
    },
    {
      title: "管理版本列表",
      description: "获取和管理所有可用的版本配置",
      category: "版本管理",
      code: `import { useVersions } from '../hooks';

const MyComponent = () => {
  const [versions, setVersions] = useVersions();
  
  return (
    <div>
      <h3>可用版本</h3>
      {versions.map(version => (
        <div key={version.id}>
          <h4>{version.name}</h4>
          <p>{version.description}</p>
          <small>创建时间: {version.createdAt}</small>
        </div>
      ))}
    </div>
  );
};`,
    },
    {
      title: "检查功能是否启用",
      description: "检查特定功能是否在当前版本中启用",
      category: "功能检查",
      code: `import { useFeatureEnabled } from '../hooks';

const MyComponent = () => {
  const dashboardEnabled = useFeatureEnabled('dashboard');
  const pipelinesEnabled = useFeatureEnabled('projects.pipelines');
  
  return (
    <div>
      {dashboardEnabled && <DashboardComponent />}
      {pipelinesEnabled && <PipelinesComponent />}
    </div>
  );
};`,
    },
    {
      title: "获取功能参数",
      description: "获取功能的具体参数配置",
      category: "功能配置",
      code: `import { useFeatureParams } from '../hooks';

const MyComponent = () => {
  const dashboardParams = useFeatureParams('dashboard');
  const projectsParams = useFeatureParams('projects');
  const pipelinesParams = useFeatureParams('projects.pipelines');
  
  return (
    <div>
      <Dashboard layout={dashboardParams.layout} />
      <Projects maxProjects={projectsParams.maxProjects} />
      <Pipelines maxPipelines={pipelinesParams.maxPipelines} />
    </div>
  );
};`,
    },
    {
      title: "管理功能模式",
      description: "获取和管理功能模式配置",
      category: "高级用法",
      code: `import { useFeatureSchema } from '../hooks';

const MyComponent = () => {
  const [schema, setSchema] = useFeatureSchema();
  
  const updateSchema = () => {
    const newSchema = JSON.stringify({
      // 新的功能配置
    }, null, 2);
    setSchema(newSchema);
  };
  
  return (
    <div>
      <pre>{schema}</pre>
      <button onClick={updateSchema}>更新配置</button>
    </div>
  );
};`,
    },
    {
      title: "条件渲染组件",
      description: "基于版本和功能状态进行条件渲染",
      category: "实践案例",
      code: `import { useFeatures, useFeatureEnabled } from '../hooks';

const MyComponent = () => {
  const { version } = useFeatures();
  const isEnterprise = version === 'enterprise';
  const dashboardEnabled = useFeatureEnabled('dashboard');
  const pipelinesEnabled = useFeatureEnabled('projects.pipelines');
  
  return (
    <div>
      {isEnterprise && <EnterpriseFeatures />}
      {dashboardEnabled && <DashboardComponent />}
      {pipelinesEnabled && <PipelinesComponent />}
    </div>
  );
};`,
    },
  ];

  const categories = [
    "全部",
    "基础用法",
    "版本管理",
    "功能检查",
    "功能配置",
    "高级用法",
    "实践案例",
  ];
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredExamples = codeExamples.filter(
    (example) =>
      selectedCategory === "全部" || example.category === selectedCategory
  );

  const hooks = [
    {
      name: "useFeatures()",
      description: "获取当前版本、配置和功能",
      params: "无",
      returns: "{ version, setVersion, versionConfig, features }",
      icon: "🎯",
    },
    {
      name: "useVersions()",
      description: "获取和管理版本列表",
      params: "无",
      returns: "[versions, setVersions]",
      icon: "📋",
    },
    {
      name: "useFeatureEnabled(path)",
      description: "检查功能是否启用",
      params: "path: string",
      returns: "boolean",
      icon: "✅",
    },
    {
      name: "useFeatureParams(path)",
      description: "获取功能参数",
      params: "path: string",
      returns: "object | null",
      icon: "⚙️",
    },
    {
      name: "useFeatureSchema()",
      description: "获取和管理功能模式",
      params: "无",
      returns: "[schema, setSchema]",
      icon: "📐",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">开发者文档</h2>
            <p className="text-gray-600 mt-1">版本配置管理的完整使用指南</p>
          </div>
          <div className="text-4xl">📚</div>
        </div>

        {/* 环境变量说明 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">🌍</span>
            环境变量配置
          </h3>
          <p className="text-blue-800 text-sm mb-4">
            通过设置环境变量来控制版本切换，支持以下方式：
          </p>
          <div className="space-y-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="text-blue-600 font-medium mb-1">开发环境</div>
              <code className="text-blue-800 font-mono text-sm">
                VERSION=enterprise npm run dev
              </code>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="text-blue-600 font-medium mb-1">构建时</div>
              <code className="text-blue-800 font-mono text-sm">
                VERSION=community npm run build
              </code>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="text-blue-600 font-medium mb-1">运行时</div>
              <code className="text-blue-800 font-mono text-sm">
                globalThis.__VERSION__ 自动注入
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* 可用的 Hooks */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🎣</span>
          可用的 Hooks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hooks.map((hook, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200"
            >
              <div className="flex items-center justify-between mb-2">
                <code className="font-mono text-green-800 font-semibold">
                  {hook.name}
                </code>
                <span className="text-2xl">{hook.icon}</span>
              </div>
              <p className="text-green-700 text-sm mb-3">{hook.description}</p>
              <div className="space-y-1 text-xs">
                <div className="text-green-600">
                  <span className="font-medium">参数:</span> {hook.params}
                </div>
                <div className="text-green-600">
                  <span className="font-medium">返回:</span> {hook.returns}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 代码示例 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">💡</span>
            使用示例
          </h3>
          <div className="text-sm text-gray-600">
            {filteredExamples.length} 个示例
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredExamples.map((example, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="bg-gray-50 p-4 border-b cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setSelectedExample(selectedExample === index ? null : index)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {example.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {example.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                      {example.category}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        selectedExample === index ? "rotate-180" : ""
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
                  </div>
                </div>
              </div>
              {selectedExample === index && (
                <div className="bg-gray-900 text-gray-100 p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 最佳实践 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🌟</span>
          最佳实践
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "使用 useFeatures 一次性获取版本、配置和功能信息",
            "使用 useFeatureEnabled 进行条件渲染，避免渲染不可用的功能",
            "使用 useFeatureParams 获取功能参数，确保配置的灵活性",
            "支持嵌套路径，如 'projects.pipelines' 来检查子功能",
            "使用 useVersions 管理多个版本配置",
            "使用 useFeatureSchema 自定义功能模式配置",
            "在开发环境中测试不同版本的功能差异",
            "合理使用版本控制，避免过度复杂化",
          ].map((practice, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200"
            >
              <div className="flex items-start space-x-3">
                <div className="text-yellow-600 mt-0.5">💡</div>
                <div className="text-yellow-800 text-sm">{practice}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDocs;
