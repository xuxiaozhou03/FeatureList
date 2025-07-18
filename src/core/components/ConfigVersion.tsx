import MonacoEditor from "@monaco-editor/react";
import FeatureForm from "./FeatureForm";
import type { ISchema } from "../hooks/useFeatureSchema";

interface ConfigVersionProps {
  schema: ISchema | null;
  value: any;
  setValue: (v: any) => void;
}

const ConfigVersion: React.FC<ConfigVersionProps> = ({
  schema,
  value,
  setValue,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-lg p-6 shadow">
        <h4 className="mb-2 font-semibold">配置功能</h4>
        {schema && (
          <FeatureForm schema={schema} value={value} onChange={setValue} />
        )}
      </div>
      <div className="bg-white rounded-lg flex flex-col p-4 shadow">
        <h5 className="mb-2 font-semibold">JSON 配置</h5>
        <div className="min-h-0 flex-1">
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
          />
        </div>
      </div>
    </div>
  );
};

export default ConfigVersion;
