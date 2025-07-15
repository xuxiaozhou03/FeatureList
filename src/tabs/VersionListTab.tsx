import React, { useState } from "react";
import {
  List,
  Button,
  Card,
  Form,
  Input,
  Typography,
  Switch,
  message,
  Select,
} from "antd";
import MonacoEditor from "@monaco-editor/react";
import styles from "./VersionListTab.module.css";
import { useFeatureJson } from "../hooks/useFeatureJson";
import { useVersions, type IVersion } from "../hooks/useVersions";

const defaultFeatures: IVersion["features"] = {
  user: {
    enabled: true,
    config: {
      allowBatchDelete: false,
      maxUsers: 100,
      userRole: "user",
      userStatus: "active",
      userDepartment: "IT",
    },
    addUser: {
      enabled: true,
      config: { requireEmail: false },
    },
    deleteUser: {
      enabled: false,
      config: { confirmBeforeDelete: false },
    },
  },
};

// VersionSchemaProperty 类型定义
interface VersionSchemaProperty {
  type: "object" | "string" | "number" | "boolean";
  title?: string;
  name?: string;
  required?: boolean;
  properties?: Record<string, VersionSchemaProperty>;
  enum?: string[];
  enumDesc?: string[];
}

const VersionListTab: React.FC = () => {
  const { versionSchema } = useFeatureJson();
  const { versions = [], setVersions } = useVersions();
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<"monaco" | "form">("form");
  const [form] = Form.useForm<IVersion>();

  const selectedVersion = versions.find((v) => v.name === selectedName) || null;

  const handleAdd = () => {
    // 保证 name 唯一
    let idx = 1;
    let newName = "新版本";
    while (versions.some((v) => v.name === newName)) {
      idx++;
      newName = `新版本${idx}`;
    }
    const newVersion: IVersion = {
      name: newName,
      description: "",
      features: defaultFeatures,
    };
    setVersions([...versions, newVersion]);
    setSelectedName(newVersion.name);
    message.success("已新增版本，请在右侧编辑。");
  };
  const handleDelete = (name: string) => {
    setVersions(versions.filter((v) => v.name !== name));
    if (selectedName === name) setSelectedName(null);
  };
  const handleFormFinish = (values: IVersion) => {
    setVersions(
      versions.map((v) =>
        v.name === selectedName ? { ...v, ...values, name: selectedName! } : v
      )
    );
    message.success("保存成功");
  };
  const handleMonacoChange = (value?: string) => {
    if (!selectedVersion) return;
    try {
      const obj = JSON.parse(value || "{}");
      setVersions(
        versions.map((v) =>
          v.name === selectedName ? { ...v, ...obj, name: selectedName! } : v
        )
      );
    } catch {
      // ignore parse error
    }
  };

  React.useEffect(() => {
    if (editMode === "form" && selectedVersion) {
      form.setFieldsValue(selectedVersion);
    }
  }, [selectedVersion, editMode, form]);

  function renderFormItems(
    schema: VersionSchemaProperty,
    parentKey: (string | number)[] = []
  ) {
    if (!schema || !schema.properties) return null;
    return Object.entries(schema.properties).map(([key, value]) => {
      const v = value as VersionSchemaProperty;
      const fieldKey = [...parentKey, key];
      if (v.type === "object" && v.properties) {
        return (
          <div
            key={fieldKey.join("-")}
            style={{
              borderLeft: "2px solid #e3e8ee",
              margin: "18px 0 18px 8px",
              paddingLeft: 16,
            }}
          >
            <Typography.Title
              level={5}
              style={{ marginTop: 0, marginBottom: 12 }}
            >
              {v.title || key}
            </Typography.Title>
            {renderFormItems(v, fieldKey)}
          </div>
        );
      }
      let inputNode: React.ReactNode = <Input />;
      if (v.enum && Array.isArray(v.enum)) {
        inputNode = (
          <Select style={{ width: "100%" }}>
            {v.enum.map((opt: string, idx: number) => (
              <Select.Option key={opt} value={opt}>
                {v.enumDesc && v.enumDesc[idx]
                  ? v.enumDesc[idx] + `(${opt})`
                  : opt}
              </Select.Option>
            ))}
          </Select>
        );
      } else if (v.type === "boolean") inputNode = <Switch />;
      else if (v.type === "number") inputNode = <Input type="number" />;
      return (
        <Form.Item
          key={fieldKey.join("-")}
          label={v.title || v.name || key}
          name={fieldKey}
          valuePropName={v.type === "boolean" ? "checked" : undefined}
          rules={
            v.type !== "boolean" && v.required
              ? [
                  {
                    required: true,
                    message: `请输入${v.title || v.name || key}`,
                  },
                ]
              : undefined
          }
        >
          {inputNode}
        </Form.Item>
      );
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Typography.Title level={4} className={styles.title}>
          版本列表
        </Typography.Title>
        <Button type="primary" className={styles.btn} onClick={handleAdd}>
          新增版本
        </Button>
        <List
          className={styles.list}
          dataSource={versions}
          renderItem={(v) => (
            <List.Item
              style={{
                background: selectedName === v.name ? "#e6f7ff" : undefined,
                cursor: "pointer",
              }}
              onClick={() => setSelectedName(v.name)}
              actions={[
                <Button
                  size="small"
                  type="link"
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(v.name);
                  }}
                  key="delete"
                >
                  删除
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: 500 }}>{v.name}</span>}
                description={
                  <span style={{ color: "#888" }}>{v.description}</span>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Card className={styles.card}>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
          >
            <Typography.Title
              level={4}
              className={styles.title}
              style={{ marginBottom: 0 }}
            >
              {selectedVersion
                ? `编辑版本：${selectedVersion.name}`
                : "请选择左侧版本"}
            </Typography.Title>
            {selectedVersion && (
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: 8 }}>编辑模式：</span>
                <Switch
                  checkedChildren="Monaco"
                  unCheckedChildren="表单"
                  checked={editMode === "monaco"}
                  onChange={(checked) =>
                    setEditMode(checked ? "monaco" : "form")
                  }
                />
              </div>
            )}
          </div>
          {selectedVersion ? (
            editMode === "monaco" ? (
              <MonacoEditor
                height="60vh"
                defaultLanguage="json"
                value={JSON.stringify(selectedVersion, null, 2)}
                onChange={handleMonacoChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  fontFamily: "Menlo, monospace",
                }}
                beforeMount={(monaco) => {
                  if (versionSchema) {
                    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                      validate: true,
                      schemas: [
                        {
                          uri: "http://featurelist/version-schema.json",
                          fileMatch: ["*"],
                          schema: versionSchema,
                        },
                      ],
                    });
                  }
                }}
              />
            ) : (
              <Form
                form={form}
                layout="vertical"
                initialValues={selectedVersion}
                onFinish={handleFormFinish}
                style={{ maxWidth: 500, margin: "0 auto" }}
              >
                {versionSchema &&
                  renderFormItems(
                    versionSchema as unknown as VersionSchemaProperty
                  )}
                <Form.Item style={{ marginTop: 32 }}>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                </Form.Item>
              </Form>
            )
          ) : (
            <div style={{ color: "#888", textAlign: "center", marginTop: 32 }}>
              请选择左侧版本进行编辑。
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VersionListTab;
