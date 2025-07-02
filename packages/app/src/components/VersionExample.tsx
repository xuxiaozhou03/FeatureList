import { getCurrentEnvironment } from "../utils/dynamic-import";

export function VersionExample() {
  const env = getCurrentEnvironment();

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">版本映射示例</h2>

      <div className="space-y-2">
        <p>
          <strong>原始版本:</strong> {env.version}
        </p>
        <p>
          <strong>映射版本类型:</strong> {env.versionType}
        </p>
        <p>
          <strong>环境:</strong> {env.isDev ? "开发" : "生产"}
        </p>
      </div>

      <div className="mt-4 p-4 bg-white rounded border">
        <h3 className="font-semibold mb-2">版本映射规则:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <code>community</code> → <code>community</code>
          </li>
          <li>
            <code>enterprise</code> → <code>enterprise</code>
          </li>
          <li>
            <code>professional</code> → <code>professional</code>
          </li>
          <li>
            <code>client-custom</code> → <code>professional</code>
          </li>
          <li>
            <code>any-other-value</code> → <code>professional</code>
          </li>
        </ul>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          这样可以确保任何客户定制版本都能自动获得专业版的功能，
          而不需要为每个客户单独创建配置文件。
        </p>
      </div>
    </div>
  );
}
