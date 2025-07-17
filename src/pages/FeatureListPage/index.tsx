import useFeatureSchema from "./useFeatureSchema";
import FeatureForm from "./FeatureForm";
import MonacoEditor from "@monaco-editor/react";

export default function FeatureListPage() {
  const { schema, value, setValue } = useFeatureSchema();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h2 style={{ margin: "16px 0", textAlign: "center" }}>
        可配置功能清单 (IFeature Schema)
      </h2>
      <div
        style={{ flex: 1, minHeight: 0, display: "flex", gap: 24, padding: 24 }}
      >
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 8,
            padding: 24,
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          {schema && (
            <FeatureForm schema={schema} value={value} onChange={setValue} />
          )}
        </div>
        <div
          style={{
            flex: 1,
            background: "#f6f6f6",
            borderRadius: 8,
            padding: 24,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h4>JSON 配置</h4>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MonacoEditor
              height="100%"
              defaultLanguage="json"
              value={JSON.stringify(value, null, 2)}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontFamily: "monospace",
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "on",
                automaticLayout: true,
              }}
              beforeMount={(instance) => {
                instance.languages.json.jsonDefaults.setDiagnosticsOptions({
                  validate: true,
                  schemas: [
                    {
                      fileMatch: ["*"],
                      uri: "/feature.schema.json",
                      schema,
                    },
                  ],
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
