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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-80 min-w-[240px] max-w-xs bg-white border-r border-gray-200 shadow-lg flex flex-col p-6">
        <Typography.Title
          level={4}
          className="!mb-4 !text-lg !font-bold !text-blue-900 text-center"
        >
          版本列表
        </Typography.Title>
        <Button type="primary" className="w-full mb-4" onClick={handleAdd}>
          新增版本
        </Button>
        <List
          className="flex-1 overflow-y-auto"
          dataSource={versions}
          renderItem={(v) => (
            <List.Item
              className={
                "rounded-lg mb-2 cursor-pointer transition-all " +
                (selectedName === v.name
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50 border border-transparent")
              }
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
                title={
                  <span className="font-semibold text-base">{v.name}</span>
                }
                description={
                  <span className="text-gray-500 text-sm">{v.description}</span>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <div className="flex-1 flex flex-col p-8">
        <Card className="rounded-2xl shadow-2xl p-8 bg-white">
          <div className="flex items-center mb-6">
            <Typography.Title
              level={4}
              className="!mb-0 !text-lg !font-bold !text-blue-900"
            >
              {selectedVersion
                ? `编辑版本：${selectedVersion.name}`
                : "请选择左侧版本"}
            </Typography.Title>
            {selectedVersion && (
              <div className="ml-auto flex items-center">
                <span className="mr-2 text-gray-500">编辑模式：</span>
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
                className="max-w-lg mx-auto"
              >
                {versionSchema &&
                  renderFormItems(
                    versionSchema as unknown as VersionSchemaProperty
                  )}
                <Form.Item className="mt-8">
                  <Button type="primary" htmlType="submit" className="w-full">
                    保存
                  </Button>
                </Form.Item>
              </Form>
            )
          ) : (
            <div className="text-gray-400 text-center mt-12">
              请选择左侧版本进行编辑。
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VersionListTab;
