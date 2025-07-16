import { useFeatureJson } from "../hooks/useFeatureJson";
import MonacoEditor from "@monaco-editor/react";

const VersionTab: React.FC = () => {
  const { versionSchema, tsDef } = useFeatureJson();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-0 flex flex-col items-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            版本约束文件预览
          </h3>
          <div className="flex-1 min-h-[400px]">
            <MonacoEditor
              height="400px"
              defaultLanguage="json"
              value={
                versionSchema
                  ? JSON.stringify(versionSchema, null, 2)
                  : "暂无数据"
              }
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Menlo, monospace",
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            TypeScript 定义预览
          </h3>
          <div className="flex-1 min-h-[400px]">
            <MonacoEditor
              height="400px"
              defaultLanguage="typescript"
              value={tsDef}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Menlo, monospace",
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionTab;
