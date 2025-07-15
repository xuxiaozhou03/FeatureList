import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { useFeatureJson, type FeatureJson } from "../hooks/useFeatureJson";
import schema from "./features-schema.json";
import styles from "./FeatureTab.module.css";

const FeatureTreePreview: React.FC<{ json: FeatureJson }> = ({ json }) => {
  const renderTree = (node: Record<string, unknown>, key = "root") => {
    if (!node) return null;
    return (
      <ul className={styles.ul}>
        {Object.entries(node).map(([k, v]) => (
          <li key={key + k} className={styles.li}>
            <span className={styles.key}>{k}</span>
            {typeof v === "object" && v !== null ? (
              renderTree(v as Record<string, unknown>, key + k)
            ) : (
              <span>: {String(v)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  };
  return <div className={styles.tree}>{json ? renderTree(json) : null}</div>;
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
          <FeatureTreePreview json={json} />
        </div>
      </div>
    </div>
  );
};

export default FeatureTab;
