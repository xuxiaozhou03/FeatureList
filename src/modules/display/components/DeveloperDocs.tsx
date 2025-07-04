const DeveloperDocs = () => {
  const codeExamples = [
    {
      title: "获取当前版本和配置",
      description: "通过 useFeatures 获取当前版本和完整配置信息",
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">开发者文档</h2>

      {/* 环境变量说明 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">环境变量配置</h3>
        <p className="text-blue-800 text-sm mb-3">
          通过设置环境变量来控制版本切换，支持以下方式：
        </p>
        <div className="space-y-2 text-sm">
          <div className="bg-blue-100 p-2 rounded font-mono">
            <span className="text-blue-600">开发环境:</span> VERSION=enterprise
            npm run dev
          </div>
          <div className="bg-blue-100 p-2 rounded font-mono">
            <span className="text-blue-600">构建时:</span> VERSION=community npm
            run build
          </div>
          <div className="bg-blue-100 p-2 rounded font-mono">
            <span className="text-blue-600">运行时:</span>{" "}
            globalThis.__VERSION__ 自动注入
          </div>
        </div>
      </div>

      {/* 可用的 Hooks */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-medium text-green-900 mb-2">可用的 Hooks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-green-100 p-2 rounded">
            <code className="font-mono text-green-800">useFeatures()</code>
            <p className="text-green-700 mt-1">获取当前版本、配置和功能</p>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <code className="font-mono text-green-800">useVersions()</code>
            <p className="text-green-700 mt-1">获取和管理版本列表</p>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <code className="font-mono text-green-800">
              useFeatureEnabled(path)
            </code>
            <p className="text-green-700 mt-1">检查功能是否启用</p>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <code className="font-mono text-green-800">
              useFeatureParams(path)
            </code>
            <p className="text-green-700 mt-1">获取功能参数</p>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <code className="font-mono text-green-800">useFeatureSchema()</code>
            <p className="text-green-700 mt-1">获取和管理功能模式</p>
          </div>
        </div>
      </div>

      {/* 代码示例 */}
      <div className="space-y-6">
        <h3 className="font-medium text-gray-900">使用示例</h3>

        {codeExamples.map((example, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 p-3 border-b">
              <h4 className="font-medium text-gray-900">{example.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {example.description}
              </p>
            </div>
            <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
              <code>{example.code}</code>
            </pre>
          </div>
        ))}
      </div>

      {/* 最佳实践 */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium text-yellow-900 mb-2">最佳实践</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 使用 useFeatures 一次性获取版本、配置和功能信息</li>
          <li>• 使用 useFeatureEnabled 进行条件渲染，避免渲染不可用的功能</li>
          <li>• 使用 useFeatureParams 获取功能参数，确保配置的灵活性</li>
          <li>• 支持嵌套路径，如 'projects.pipelines' 来检查子功能</li>
          <li>• 使用 useVersions 管理多个版本配置</li>
          <li>• 使用 useFeatureSchema 自定义功能模式配置</li>
          <li>• 在开发环境中测试不同版本的功能差异</li>
        </ul>
      </div>
    </div>
  );
};

export default DeveloperDocs;
