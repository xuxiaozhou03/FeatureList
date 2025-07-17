import MonacoEditor from "@monaco-editor/react";
import useDefine from "../hooks/useDefine";

const PreviewDefine: React.FC = () => {
  const { str: defineText } = useDefine();

  return (
    <div className="flex-1 bg-gray-100 rounded-lg p-6 overflow-auto flex flex-col">
      <h4 className="mb-2 font-semibold">功能清单定义</h4>
      <div className="flex gap-6 min-h-0 flex-1">
        <div style={{ flex: 1, minWidth: 0 }}>
          <MonacoEditor
            height="100%"
            defaultLanguage="typescript"
            value={defineText}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontFamily: "monospace",
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              lineNumbers: "on",
              automaticLayout: true,
            }}
          />
        </div>
        <div className="w-80 bg-white rounded-lg p-5 shadow text-[14px] text-gray-700 flex-shrink-0 ml-2 self-start leading-7">
          <div style={{ fontWeight: 600, marginBottom: 8 }}>格式要求</div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <li>
              必须为 <b>TypeScript 对象</b> 格式
            </li>
            <li>
              每个功能项需包含 <code>enabled</code> 字段，且可包含{" "}
              <code>config</code> 字段
            </li>
            <li>
              <code>config</code> 字段可继续配置子功能或参数
            </li>
            <li>
              每个参数可带注释（如 <code>@min</code>、<code>@max</code>、
              <code>@default</code>、<code>@description</code>）
            </li>
            <li>
              示例：
              <pre className="bg-gray-50 p-2 rounded mt-1 text-xs overflow-x-auto">
                {`dashboard: {
  // 是否启用工作台
  enabled: boolean;
  config: {
    /**
     * 最大显示项目数
     * @min 1
     * @max 100
     * @default 5
     * @description 工作台上显示的项目数量限制，超过此数量将不再
     */
    maxItems: number;
    // 子功能示例
    subFeature: {
      enabled: boolean;
      config: {
        // ...
      }
    }
  }
}`}
              </pre>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PreviewDefine;
