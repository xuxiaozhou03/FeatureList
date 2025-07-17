// 备注：建议所有 Demo 组件（index.community.tsx、index.premium.tsx、index.tsx）
// 的 props 入参和返回类型保持一致，便于多版本无缝切换和类型安全。
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Demo from "./demo";

const DemoPanel = () => {
  return (
    <>
      <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-800 text-sm flex items-center">
        <ExclamationCircleOutlined
          className="mr-2 text-yellow-400"
          style={{ fontSize: 20 }}
        />
        <span>
          <strong>建议：</strong>所有 Demo
          组件（index.community.tsx、index.premium.tsx、index.tsx）的{" "}
          <span className="font-mono">props</span>{" "}
          入参和返回类型保持一致，便于多版本无缝切换和类型安全。
        </span>
      </div>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 shadow rounded-lg">
        <div className="flex items-center mb-2">
          <ExclamationCircleOutlined
            className="mr-2 text-blue-700"
            style={{ fontSize: 20 }}
          />
          <span className="font-semibold text-blue-700">
            关于 <code>import Demo from "./demo"</code> 的说明
          </span>
        </div>
        <div className="text-gray-700 text-sm leading-relaxed">
          这行代码是多版本构建的关键。通过
          <span className="font-mono bg-gray-100 px-1 rounded">
            {" "}
            vite.config.ts{" "}
          </span>
          配置 alias，
          <br />
          <span className="font-mono bg-gray-100 px-1 rounded">
            import Demo from "./demo"
          </span>
          会在不同构建命令下自动指向不同实现：
          <ul className="list-disc pl-6 my-2">
            <li>
              <span className="font-mono">PLATFORM=community pnpm build</span> →{" "}
              <span className="font-mono">index.community.tsx</span>
            </li>
            <li>
              <span className="font-mono">PLATFORM=premium pnpm build</span> →{" "}
              <span className="font-mono">index.premium.tsx</span>
            </li>
            <li>
              <span className="font-mono">PLATFORM=enterprise pnpm build</span>{" "}
              → <span className="font-mono">index.tsx</span>
            </li>
          </ul>
          <span className="block mt-2 text-red-500 font-medium">
            注意：该差异属于<strong>构建时</strong>决定，
            <strong>运行时无法切换</strong>，如需切换需重新构建！
          </span>
          这样无需修改业务代码，即可实现多平台差异化功能。
        </div>
      </div>
      <Demo />
      <div className=""></div>
    </>
  );
};

export default DemoPanel;
