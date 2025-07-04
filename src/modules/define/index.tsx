import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import FeaturePreview from "./components/FeaturePreview";
import { useFeatureSchema } from "../hooks";
import schema from "../hooks/feature.schema.json";

const DefinePage = () => {
  const [value, setValue] = useFeatureSchema();
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                功能清单定义
              </h1>
              <p className="text-sm text-gray-600">
                定义项目的功能清单，支持嵌套功能和参数配置
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                {isPreviewExpanded ? "收起预览" : "展开预览"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`grid gap-6 ${
            isPreviewExpanded
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 lg:grid-cols-3"
          }`}
        >
          {/* Editor Panel */}
          <div
            className={isPreviewExpanded ? "lg:col-span-1" : "lg:col-span-2"}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      JSON 编辑器
                    </h2>
                    <p className="text-slate-300 text-sm mt-1">
                      编辑功能清单配置
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <MonacoEditor
                  height="600px"
                  language="json"
                  theme="vs-dark"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue || "");
                  }}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                    },
                  }}
                  beforeMount={(instance) => {
                    instance.languages.json.jsonDefaults.setDiagnosticsOptions({
                      validate: true,
                      schemas: [
                        {
                          uri: "feature-schema.json",
                          schema,
                          fileMatch: ["*"],
                        },
                      ],
                    });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div
            className={isPreviewExpanded ? "lg:col-span-1" : "lg:col-span-1"}
          >
            <FeaturePreview jsonData={value || ""} />
          </div>
        </div>

        {/* Schema Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📋</span>
            Schema 信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-900">支持的字段</h4>
                <span className="text-2xl">📝</span>
              </div>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• enabled: 功能启用状态</li>
                <li>• params: 功能参数配置</li>
                <li>• children: 子功能嵌套</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900">验证规则</h4>
                <span className="text-2xl">✅</span>
              </div>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• JSON 语法校验</li>
                <li>• Schema 结构验证</li>
                <li>• 实时错误提示</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-900">编辑器功能</h4>
                <span className="text-2xl">⚡</span>
              </div>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>• 语法高亮</li>
                <li>• 自动补全</li>
                <li>• 代码折叠</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefinePage;
