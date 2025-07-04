import MonacoEditor from "@monaco-editor/react";
import { Card, Typography, Row, Col } from "antd";
import FeaturePreview from "./components/FeaturePreview";
import { useFeatureSchema } from "../hooks";
import schema from "../hooks/feature.schema.json";

const { Title, Paragraph } = Typography;

const DefinePage = () => {
  const [value, setValue] = useFeatureSchema();

  return (
    <div>
      <div className="mb-4">
        <Title level={3}>功能清单定义</Title>
        <Paragraph>定义项目的功能清单，支持嵌套功能和参数配置。</Paragraph>
      </div>

      <Row gutter={16}>
        <Col span={16}>
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
        </Col>
        <Col span={8}>
          <FeaturePreview jsonData={value || ""} />
        </Col>
      </Row>
    </div>
  );
};

export default DefinePage;
