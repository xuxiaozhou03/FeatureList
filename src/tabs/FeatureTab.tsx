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
    <div className="my-4">
      <div className="text-blue-600 font-semibold text-base mb-1">
        属性配置：
      </div>
      <ul className="list-none pl-0">
        {configList.map((attr, idx) => (
          <li
            key={attr.name || idx}
            className="flex items-center bg-gray-50 rounded-lg px-4 py-2 mb-2 shadow-sm text-base"
          >
            <span className="font-medium text-gray-800">{attr.name}</span>
            {attr.type && (
              <Tag color="blue" className="ml-2">
                {attr.type}
              </Tag>
            )}
            {attr.description && (
              <span className="ml-2 text-gray-500">（{attr.description}）</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// 单个功能渲染组件
const DefineFeatureView: React.FC<{ feature: DefineFeature }> = ({
  feature,
}) => {
  const name = String(feature.name || "");
  const description = String(feature.description || "");
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
  return (
    <div className="ml-8 border-l-4 border-gray-200 pl-6 mb-8 bg-white rounded-xl shadow-lg transition-shadow hover:shadow-2xl">
      <div className="text-lg font-bold text-gray-800 flex items-center mb-1">
        <span>{name}</span>
        {description && (
          <span className="ml-3 text-base text-gray-500 font-normal">
            （{description}）
          </span>
        )}
      </div>
      <ConfigView config={feature.config} />
      {children.length > 0 && (
        <div className="mt-4">
          <div className="text-orange-500 font-semibold text-base mb-1">
            子功能：
          </div>
          <ul className="list-none pl-0">
            {children.map((child, idx) => (
              <li
                key={child.name || idx}
                className="mb-3 relative before:content-[''] before:absolute before:left-[-28px] before:top-4 before:w-6 before:h-1 before:bg-gray-200 before:rounded"
              >
                <DefineFeatureView feature={child} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// FeatureJson 根节点渲染组件
const FeatureJsonView: React.FC<{ data: FeatureJson }> = ({ data }) => {
  if (!data) return null;
  return (
    <div className="mt-2">
      {Object.values(data).map((feature, idx) => (
        <DefineFeatureView key={feature.name || idx} feature={feature} />
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
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-12">
      <h2 className="text-3xl font-extrabold text-center text-blue-900 tracking-wide mb-12">
        功能清单定义与预览
      </h2>
      <div className="flex gap-12 justify-center items-start">
        <div className="flex-1 max-w-xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <MonacoEditor
              height="80vh"
              defaultLanguage="json"
              value={jsonString}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                fontFamily: "Menlo, monospace",
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
        </div>
        <div className="flex-1 max-w-xl">
          <h3 className="text-xl font-bold text-gray-700 mb-6 tracking-wide">
            功能清单树预览
          </h3>
          <FeatureJsonView data={json} />
        </div>
      </div>
    </div>
  );
};

export default FeatureTab;
