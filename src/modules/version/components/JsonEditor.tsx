import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { Card, Typography } from "antd";
import { CodeOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
    <Card
      className="shadow-md border-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      styles={{ body: { padding: 0 } }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <Title level={4} className="text-white mb-0 flex items-center gap-2">
          <CodeOutlined />
          {title}
        </Title>
      </div>
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
        </div>
      </div>
    </Card>
  );
};

export default JsonEditor;
