import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { useFeatureJson } from "../hooks/useFeatureJson";
import type { DefineFeature, FeatureJson } from "../hooks/useFeatureJson";
import schema from "./features-schema.json";
import { Tag } from "antd";

// 属性配置渲染组件
const ConfigView: React.FC<{ config?: DefineFeature["config"] }> = ({
  config,
}) => {
  if (!config) return null;
  const configList = Object.values(config);
  if (configList.length === 0) return null;
  return (
    <div className="my-6">
      <div className="text-blue-700 font-semibold text-base mb-2 flex items-center gap-2">
        <span className="inline-block w-1.5 h-4 bg-blue-400 rounded-sm mr-2"></span>
        属性配置
      </div>
      <ul className="list-none pl-0">
        {configList.map((attr, idx) => (
          <li
            key={attr.name || idx}
            className="flex items-center bg-blue-50/60 rounded-lg px-4 py-2 mb-2 shadow-sm text-base hover:bg-blue-100/70 transition-colors"
          >
            <span className="font-medium text-blue-900 mr-2">{attr.name}</span>
            {attr.type && (
              <Tag
                color="blue"
                className="ml-2 px-2 py-0.5 text-xs font-semibold rounded"
              >
                {attr.type}
              </Tag>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 单个功能渲染组件
// 递归渲染，支持层级色彩
const layerColors = [
  {
    card: "bg-white/95 border border-blue-100/60",
    line: "bg-gradient-to-b from-blue-200/80 to-blue-100/0",
  },
  {
    card: "bg-blue-50/90 border border-blue-100/60",
    line: "bg-gradient-to-b from-blue-300/60 to-blue-100/0",
  },
  {
    card: "bg-blue-100/90 border border-blue-200/60",
    line: "bg-gradient-to-b from-blue-400/50 to-blue-100/0",
  },
  {
    card: "bg-blue-200/90 border border-blue-200/60",
    line: "bg-gradient-to-b from-blue-500/40 to-blue-100/0",
  },
];

const DefineFeatureView: React.FC<{
  feature: DefineFeature;
  depth?: number;
}> = ({ feature, depth = 0 }) => {
  const name = String(feature.name || "");
  // 子功能：遍历除 name/description/config 外的所有 DefineFeature 类型字段
  const children: DefineFeature[] = Object.entries(feature)
    .filter(
      ([k, v]) =>
        k !== "name" &&
        k !== "description" &&
        k !== "config" &&
        v &&
        typeof v === "object" &&
        "name" in v &&
        "description" in v
    )
    .map((arr) => arr[1] as DefineFeature);
  const color = layerColors[depth % layerColors.length];
  return (
    <div className={`relative ml-6 pl-6 mb-12`}>
      {/* 树形主干线 */}
      <div
        className={`absolute left-2 top-0 h-full w-1 ${color.line} z-0 rounded-full opacity-70`}
        style={{ filter: "blur(0.5px)" }}
      />
      <div
        className={`relative z-10 ${color.card} rounded-2xl shadow-[0_4px_24px_0_rgba(60,120,255,0.07)] p-6 group transition-all duration-200 hover:shadow-[0_8px_32px_0_rgba(60,120,255,0.13)] hover:scale-[1.025] hover:bg-blue-50/60`}
      >
        <div className="text-lg font-bold flex items-center mb-2 group-hover:text-blue-700 transition-colors">
          <span className="mr-2 text-blue-900 drop-shadow-sm tracking-wide">
            {name}
          </span>
        </div>
        <div className="rounded-xl bg-blue-50/40 px-3 py-2 mb-2">
          <ConfigView config={feature.config} />
        </div>
        {children.length > 0 && (
          <div className="mt-5 border-t border-dashed border-orange-100/80 pt-3 bg-gradient-to-r from-orange-50/40 to-transparent rounded-b-xl">
            <div className="text-orange-500 font-semibold text-xs mb-2 flex items-center gap-2">
              <span className="inline-block w-1 h-3 bg-gradient-to-b from-orange-300 to-orange-100 rounded-sm mr-2"></span>
              子功能
            </div>
            <ul className="list-none pl-0">
              {children.map((child, idx) => (
                <li
                  key={child.name || idx}
                  className="mb-4 relative before:content-[''] before:absolute before:left-[-22px] before:top-6 before:w-5 before:h-0.5 before:bg-gradient-to-r before:from-orange-200 before:to-orange-50 before:rounded before:opacity-80"
                >
                  <DefineFeatureView feature={child} depth={depth + 1} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// FeatureJson 根节点渲染组件
const FeatureJsonView: React.FC<{ data: FeatureJson }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="mt-2">
      {Object.values(data).map((feature, idx) => (
        <div key={feature.name || idx} className="mb-10">
          <DefineFeatureView feature={feature} depth={0} />
        </div>
      ))}
    </div>
  );
};

const FeatureTab: React.FC = () => {
  const { json, jsonString, setJson } = useFeatureJson();

  const handleEditorChange = (value?: string) => {
    setJson(value || "");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen py-12">
      <h2 className="text-4xl font-extrabold text-center text-blue-900 tracking-wide mb-14 drop-shadow-lg">
        功能清单定义与预览
      </h2>
      <div className="mx-auto flex w-full max-w-7xl gap-10 items-start flex-col md:flex-row">
        {/* 编辑区 2/3 */}
        <div className="w-full md:w-2/3 pr-0 md:pr-6 mb-10 md:mb-0">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 min-h-[60vh] md:min-h-[80vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-6">
                <span className="inline-block w-2 h-8 bg-blue-400 rounded-sm mr-4"></span>
                <span className="text-2xl font-bold text-blue-900 tracking-wide">
                  JSON 编辑区
                </span>
              </div>
              <MonacoEditor
                height="60vh"
                defaultLanguage="json"
                value={jsonString}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  fontFamily: "Menlo, monospace",
                  scrollBeyondLastLine: false,
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                }}
                beforeMount={(monaco) => {
                  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                    validate: true,
                    schemas: [
                      {
                        uri: "http://featurelist/schema.json",
                        fileMatch: ["*"],
                        schema: schema,
                      },
                    ],
                  });
                }}
              />
            </div>
            <div className="mt-8 border-t border-blue-100 pt-6 text-sm text-gray-400 text-right">
              编辑 JSON 可实时预览右侧树形结构
            </div>
          </div>
        </div>
        {/* 展示区 1/3 */}
        <div className="w-full md:w-1/3 pl-0 md:pl-6">
          <div className="relative bg-gradient-to-br from-blue-100/70 via-white to-blue-50/90 rounded-2xl shadow-lg px-4 md:px-6 py-6 min-h-[40vh] md:min-h-[60vh] flex flex-col transition-all hover:shadow-2xl border border-blue-100/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-1.5 h-6 bg-blue-400 rounded mr-2"></span>
              <h3 className="text-xl font-extrabold text-blue-900 tracking-wide drop-shadow-sm">
                功能清单树预览
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              <FeatureJsonView data={json} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureTab;
