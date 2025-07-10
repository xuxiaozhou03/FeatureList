import React from "react";
import { Button, Space, Alert } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import MonacoJsonEditor from "./MonacoJsonEditor";
import { FEATURE_DEFINITION_SCHEMA } from "@/schemas/featureSchema";
import styles from "../index.module.css";

interface EditorTabProps {
  jsonValue: string;
  validationErrors: string[];
  onJsonChange: (value: string) => void;
  onLoadExample: () => void;
  onReset: () => void;
  onFormat: () => void;
  onValidate: () => void;
}

const EditorTab: React.FC<EditorTabProps> = ({
  jsonValue,
  validationErrors,
  onJsonChange,
  onLoadExample,
  onReset,
  onFormat,
  onValidate,
}) => {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorToolbar}>
        <Space>
          <Button size="small" onClick={onLoadExample}>
            加载示例
          </Button>
          <Button size="small" onClick={onReset}>
            重置为空模板
          </Button>
          <Button size="small" onClick={onFormat}>
            格式化 JSON
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onValidate}
          >
            验证
          </Button>
        </Space>
      </div>

      {validationErrors.length > 0 && (
        <Alert
          type="error"
          message="功能定义验证错误"
          description={
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <MonacoJsonEditor
        value={jsonValue}
        onChange={onJsonChange}
        height={600}
        schema={FEATURE_DEFINITION_SCHEMA}
        language="json"
        theme="vs"
      />
    </div>
  );
};

export default EditorTab;
