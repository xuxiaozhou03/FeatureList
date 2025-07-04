import MonacoEditor from "@monaco-editor/react";
import schema from "./feature.schema.json";
import { Card, Typography } from "antd";
import { useLocalStorageState } from "ahooks";

const { Title, Paragraph } = Typography;

export const useFeatureSchema = () => {
  return useLocalStorageState(
    "feature-schema",
    JSON.stringify(schema.example, null, 2)
  );
};

const DefinePage = () => {
  const [value, setValue] = useFeatureSchema();

  return (
    <div>
      <div className="mb-4">
        <Title level={3}>功能清单定义</Title>
        <Paragraph>
          定义项目的功能清单，支持嵌套功能和参数配置。修改后点击"去配置版本"按钮，在版本配置页面会自动生成对应的版本配置结构。
        </Paragraph>
      </div>

      <Card title="功能清单 JSON 编辑器">
        <MonacoEditor
          height="500px"
          language="json"
          theme="vs-dark"
          value={value} // 使用 schema 的示例值
          onChange={(newValue) => {
            setValue(newValue || "");
          }}
          beforeMount={(instance) => {
            instance.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true, // 启用验证
              schemas: [
                {
                  uri: "feature-schema.json", // schema 的 URI
                  schema,
                  fileMatch: ["*"], // 匹配所有 JSON 文件
                },
              ],
            });
          }}
        />
      </Card>
    </div>
  );
};

export default DefinePage;
