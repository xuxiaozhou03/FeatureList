import React from "react";

const IndexPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">
        如何通过环境变量和版本清单控制页面元素展示
      </h1>
      <div className="mb-6 text-gray-700 leading-7">
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <b>通过环境变量指定版本：</b>
            <div className="bg-gray-50 rounded p-3 my-2 text-sm">
              <code>VERSION=enterprise pnpm run dev</code>
            </div>
            <div className="text-xs text-gray-500">
              （或使用 <code>pnpm run dev:enterprise</code> 等命令）
            </div>
          </li>
          <li>
            <b>在代码中获取当前版本：</b>
            <pre className="bg-gray-50 rounded p-2 my-2 text-xs overflow-x-auto">
              {`const version = import.meta.env.VERSION || "community";`}
            </pre>
          </li>
          <li>
            <b>根据版本清单控制页面元素：</b>
            <pre className="bg-gray-50 rounded p-2 my-2 text-xs overflow-x-auto">
              {`// 例如只在企业版展示某按钮
if (version === "enterprise") {
  return <Button>企业专属功能</Button>;
}`}
            </pre>
            <div className="text-xs text-gray-500">
              可结合版本功能清单（如 features）做更细粒度的控制
            </div>
          </li>
        </ol>
        <div className="mt-6 text-sm text-gray-500">
          <b>建议：</b> 统一用 <code>import.meta.env.VERSION</code>{" "}
          获取版本，结合后端/本地配置的功能清单（features）灵活控制页面内容。
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
