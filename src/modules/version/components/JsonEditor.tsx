import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { Card } from "antd";

interface JsonEditorProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  schema?: any;
  readOnly?: boolean;
  height?: string;
  language?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  title,
  value,
  onChange,
  schema,
  readOnly = false,
  height = "500px",
  language = "json",
}) => {
  return (
    <Card title={title} size="small">
      <MonacoEditor
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(newValue) => {
          if (!readOnly && onChange) {
            onChange(newValue || "");
          }
        }}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        beforeMount={(instance) => {
          if (schema && language === "json") {
            instance.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              schemas: [
                {
                  uri: "schema.json",
                  schema,
                  fileMatch: ["*"],
                },
              ],
            });
          }
        }}
      />
    </Card>
  );
};

export default JsonEditor;
