import React from "react";
import { useFeatureJson } from "../hooks/useFeatureJson";
import MonacoEditor from "@monaco-editor/react";

const VersionTab: React.FC = () => {
  const { versionSchema, tsDef } = useFeatureJson();

  return (
    <div style={{ display: "flex", gap: 32, height: "70vh" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ marginBottom: 8 }}>版本约束文件预览</h3>
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ marginBottom: 8 }}>TypeScript 定义预览</h3>
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
