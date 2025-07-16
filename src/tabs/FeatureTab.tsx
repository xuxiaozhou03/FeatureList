import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { useFeatureJson } from "../hooks/useFeatureJson";
import type { DefineFeature, FeatureJson } from "../hooks/useFeatureJson";
import schema from "./features-schema.json";
import styles from "./FeatureTab.module.css";
import { Tag } from "antd";

// 属性配置渲染组件
const ConfigView: React.FC<{ config?: DefineFeature["config"] }> = ({
  config,
}) => {
  if (!config) return null;
  const configList = Object.values(config);
  if (configList.length === 0) return null;
  return (
    <div className={styles.configBlock}>
      <div className={styles.configTitle}>属性配置：</div>
      <ul className={styles.configList}>
        {configList.map((attr, idx) => (
          <li key={attr.name || idx} className={styles.configItem}>
            <span className={styles.attrName}>{attr.name}</span>
            {attr.type && (
              <Tag color="blue" style={{ marginLeft: 4 }}>
                {attr.type}
              </Tag>
            )}
            {attr.description && (
              <span className={styles.attrDesc}>（{attr.description}）</span>
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
    <div className={styles.featureNode}>
      <div className={styles.featureTitle}>
        <strong>{name}</strong>
        {description && (
          <span className={styles.featureDesc}>（{description}）</span>
        )}
      </div>
      <ConfigView config={feature.config} />
      {children.length > 0 && (
        <div className={styles.childrenBlock}>
          <div className={styles.childrenTitle}>子功能：</div>
          <ul className={styles.childrenList}>
            {children.map((child, idx) => (
              <li key={child.name || idx} className={styles.childItem}>
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
    <div className={styles.featureJsonView}>
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
    <div className={styles.container}>
      <h2 className={styles.title}>功能清单定义与预览</h2>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.editor}>
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
        <div className={styles.col}>
          <h3 className={styles.treeTitle}>功能清单树预览</h3>
          <FeatureJsonView data={json} />
        </div>
      </div>
    </div>
  );
};

export default FeatureTab;
