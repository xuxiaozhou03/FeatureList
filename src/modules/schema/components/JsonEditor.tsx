import React from "react";
import MonacoEditor from "@monaco-editor/react";

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  schema?: any;
  readOnly?: boolean;
  height?: string;
  language?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  schema,
  readOnly = false,
  height = "500px",
  language = "json",
}) => {
  return (
    <MonacoEditor
      height={height}
      language={language}
      theme="vs-light"
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
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
        },
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: "none",
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
  );
};

export default JsonEditor;
