import React from "react";
import { FeatureListPage } from "./core";
import DemoPage from "./pages/demoPage";
import { Modal } from "antd";

const IndexPage: React.FC = () => {
  const [isFeatureListVisible, setFeatureListVisible] = React.useState(false);
  const [isDemoVisible, setDemoVisible] = React.useState(false);

  return (
    <div className="overflow-auto">
      <div className="w-screen flex justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <div className="w-full py-10 px-4 shadow-xl rounded-xl bg-white/80">
          <h1 className="text-5xl font-extrabold mb-6 text-blue-700 text-center tracking-tight drop-shadow-lg">
            <span className="inline-block bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              FeatureList
            </span>
            <span className="block text-xl font-light text-indigo-500 mt-2">
              功能清单平台
            </span>
          </h1>
          <p className="text-lg text-gray-700 mb-10 text-center font-mono animate-pulse">
            一站式多版本功能管理与页面内容控制解决方案
          </p>
          <div className="flex justify-center gap-6 mt-8 mb-12">
            <a
              onClick={() => setFeatureListVisible(true)}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-lg"
            >
              功能清单
            </a>
            <a
              onClick={() => setDemoVisible(true)}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition-colors text-lg"
            >
              演示页面
            </a>
          </div>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              为什么选择 FeatureList？
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>支持企业版、社区版等多版本灵活配置，满足不同业务需求</li>
              <li>功能项可视化管理，配置简单，实时预览</li>
              <li>环境变量与功能清单统一驱动，前后端无缝集成</li>
            </ul>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
              核心功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:scale-105 transition-transform">
                <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-1">
                  <span className="material-icons text-indigo-400">layers</span>
                  多版本内容控制
                </h3>
                <p className="text-gray-600">
                  通过环境变量和功能清单，灵活切换和控制页面内容与功能。
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 hover:scale-105 transition-transform">
                <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-1">
                  <span className="material-icons text-blue-400">
                    visibility
                  </span>
                  可视化配置与预览
                </h3>
                <p className="text-gray-600">
                  支持在线编辑、预览和导出功能项，提升协作与开发效率。
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 hover:scale-105 transition-transform">
                <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-1">
                  <span className="material-icons text-purple-400">
                    settings
                  </span>
                  多种控制
                </h3>
                <p className="text-gray-600">
                  支持运行时和构建时控制，灵活适配不同业务场景。
                </p>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
              应用场景
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>企业/社区/定制版功能差异化管理</li>
              <li>前端页面按版本动态展示内容</li>
              <li>后端接口按版本返回不同配置数据</li>
            </ul>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
              快速上手
            </h2>
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <b>指定版本环境变量：</b>
                <div className="bg-gray-50 rounded p-3 my-2 text-sm font-mono border border-blue-100">
                  <code>pnpm run dev:enterprise</code>
                </div>
                <div className="text-xs text-gray-500">
                  推荐使用 <code>pnpm run dev:enterprise</code> 启动企业版环境
                </div>
              </li>
              <li>
                <b>在代码中获取当前版本：</b>
                <pre className="bg-gray-50 rounded p-2 my-2 text-xs overflow-x-auto font-mono border border-indigo-100">
                  {`const version = import.meta.env.VERSION || "community";`}
                </pre>
              </li>
              <li>
                <b>根据版本和功能清单控制页面元素：</b>
                <pre className="bg-gray-50 rounded p-2 my-2 text-xs overflow-x-auto font-mono border border-purple-100">
                  {`// 只在企业版展示某按钮
if (version === "enterprise" && features.includes("exclusive")) {
  return <Button>企业专属功能</Button>;
}`}
                </pre>
                <div className="text-xs text-gray-500">
                  结合 features 做更细粒度的页面控制
                </div>
              </li>
            </ol>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-300 rounded-full animate-ping"></span>
              平台特征
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>低代码配置，支持可视化和 JSON Schema</li>
              <li>与前端/后端配置无缝集成</li>
              <li>易于扩展和维护</li>
            </ul>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-ping"></span>
              功能清单配置流程
            </h2>
            <ol className="list-decimal pl-5 space-y-6 text-gray-700">
              <li>
                <b>定义 IFeature 接口：</b>
                <div className="bg-gray-50 rounded p-3 my-2 text-xs font-mono border border-purple-100">
                  {`interface IFeature {
  dashboard: {
    enabled: boolean;
    config: {
      maxItems: number;
    };
  };
  // ...更多功能项
}`}
                </div>
              </li>
              <li>
                <b>构建功能清单约束 schema：</b>
                <div className="bg-gray-50 rounded p-3 my-2 text-xs font-mono border border-indigo-100">
                  <code>npm run schema-build</code>
                </div>
                <div className="text-xs text-gray-500">
                  自动生成 schema，保证配置合法性
                </div>
              </li>
              <li>
                <b>配置版本/功能清单：</b>
                <div className="bg-gray-50 rounded p-3 my-2 text-xs font-mono border border-blue-100">
                  {`// enterprise.json / community.json
{
  "dashboard": {
    "enabled": true,
    "config": { "maxItems": 6 }
  }
  // ...
}`}
                </div>
                <div className="text-xs text-gray-500">
                  支持多版本差异化配置
                </div>
              </li>
              <li>
                <b>在演示页面使用：</b>
                <div className="bg-gray-50 rounded p-3 my-2 text-xs font-mono border border-blue-100">
                  {`const features = useFeatures(); // 获取当前功能配置`}
                </div>
                <div className="text-xs text-gray-500">驱动页面内容和行为</div>
              </li>
              <li>
                <b>展示差异：</b>
                <div className="bg-gray-50 rounded p-3 my-2 text-xs font-mono border border-indigo-100">
                  {`// 例如
if (features.dashboard.enabled) {
  // 展示卡片，数量受 maxItems 限制
}`}
                </div>
                <div className="text-xs text-gray-500">
                  不同版本/功能清单下页面内容自动变化
                </div>
              </li>
            </ol>
          </section>
        </div>
      </div>
      <Modal
        title="功能清单"
        open={isFeatureListVisible}
        onCancel={() => setFeatureListVisible(false)}
        footer={null}
        width={"96vw"}
        height={"96vh"}
      >
        <FeatureListPage />
      </Modal>
      <Modal
        title="演示页面"
        open={isDemoVisible}
        onCancel={() => setDemoVisible(false)}
        footer={null}
        width={"96vw"}
        height={"96vh"}
      >
        <DemoPage />
      </Modal>
    </div>
  );
};

export default IndexPage;
