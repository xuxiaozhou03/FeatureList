import React from "react";
import { useFeatureJson } from "../hooks/useFeatureJson";
import MonacoEditor from "@monaco-editor/react";
import styles from "./VersionTab.module.css";

const VersionTab: React.FC = () => {
  const { versionSchema, tsDef } = useFeatureJson();

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <h3 className={styles.title}>版本约束文件预览</h3>
        <MonacoEditor
          height="100%"
          defaultLanguage="json"
          value={
            versionSchema ? JSON.stringify(versionSchema, null, 2) : "暂无数据"
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
      <div className={styles.section}>
        <h3 className={styles.title}>TypeScript 定义预览</h3>
        <MonacoEditor
          height="100%"
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
  );
};

export default VersionTab;
