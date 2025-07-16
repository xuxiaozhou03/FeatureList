import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Switch, Select, Button } from "antd";
import useFeatureSchema from "./useFeatureSchema";

export default function FeatureListPage() {
  const [schema, setSchema] = useState<Record<string, unknown> | null>(null);
  const [value, setValue] = useState<string>("");

  useFeatureSchema();

  useEffect(() => {
    fetch("/feature.schema.json")
      .then((res) => res.json())
      .then((data: Record<string, unknown>) => {
        setSchema(data);
        // 递归生成带默认值的 JSON 示例
        type JSONSchema = {
          default?: unknown;
          type?: string;
          properties?: Record<string, JSONSchema>;
          items?: JSONSchema;
          enum?: unknown[];
        };
        function fillDefaults(schema: JSONSchema, keyName?: string): unknown {
          if (schema.default !== undefined) return schema.default;
          if (schema.type === "object" && schema.properties) {
            const obj: Record<string, unknown> = {};
            for (const key in schema.properties) {
              obj[key] = fillDefaults(schema.properties[key], key);
            }
            return obj;
          }
          if (schema.type === "array" && schema.items) {
            return [fillDefaults(schema.items)];
          }
          if (schema.enum && schema.enum.length) {
            return schema.enum[0];
          }
          // enabled 字段特殊处理
          if (keyName === "enabled" && schema.type === "boolean") {
            return true;
          }
          return undefined;
        }
        setValue(JSON.stringify(fillDefaults(data), null, 2));
      });
  }, []);

  const [form] = Form.useForm();

  // 初始化表单值
  useEffect(() => {
    if (schema && value) {
      try {
        form.setFieldsValue(JSON.parse(value));
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line
  }, [schema, value]);

  // 递归渲染表单项
  type JSONSchema = {
    title?: string;
    type?: string;
    properties?: Record<string, JSONSchema>;
    items?: JSONSchema;
    enum?: unknown[];
    description?: string;
  };

  function renderFormItems(
    schema: JSONSchema,
    namePrefix: string[] = []
  ): React.ReactNode {
    if (!schema.properties || typeof schema.properties !== "object")
      return null;
    return Object.entries(schema.properties).map(([key, propSchema]) => {
      const name = [...namePrefix, key];
      const label = propSchema.title ? `${propSchema.title}(${key})` : key;
      const description = propSchema.description;
      const descriptionNode = description ? (
        <div
          style={{
            color: "#888",
            fontSize: 12,
            margin: "4px 0 0 0",
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </div>
      ) : null;
      if (propSchema.type === "object" && propSchema.properties) {
        return (
          <Form.Item
            key={name.join(".")}
            label={label}
            style={{ marginBottom: 0 }}
          >
            <div style={{ paddingLeft: 16, borderLeft: "2px solid #eee" }}>
              {renderFormItems(propSchema, name)}
            </div>
            {descriptionNode}
          </Form.Item>
        );
      }
      if (propSchema.type === "array" && propSchema.items) {
        // 只支持简单数组
        return (
          <Form.Item
            key={name.join(".")}
            label={label}
            name={name}
            rules={[{ required: false }]}
          >
            <Input.TextArea
              placeholder={`请输入${label}，用逗号分隔`}
              onChange={(e) => {
                const val = e.target.value
                  .split(",")
                  .map((v: string) => v.trim())
                  .filter(Boolean);
                form.setFieldValue(name, val);
              }}
            />
            {descriptionNode}
          </Form.Item>
        );
      }
      if (propSchema.enum) {
        return (
          <Form.Item
            key={name.join(".")}
            label={label}
            name={name}
            rules={[{ required: false }]}
          >
            <Select
              options={propSchema.enum.map((v) => ({
                label: String(v),
                value: v,
              }))}
            />
            {descriptionNode}
          </Form.Item>
        );
      }
      if (propSchema.type === "boolean") {
        return (
          <Form.Item
            key={name.join(".")}
            label={label}
            name={name}
            valuePropName="checked"
            rules={[{ required: false }]}
          >
            <Switch />
            {descriptionNode}
          </Form.Item>
        );
      }
      if (propSchema.type === "number" || propSchema.type === "integer") {
        return (
          <Form.Item
            key={name.join(".")}
            label={label}
            name={name}
            rules={[{ required: false }]}
          >
            <InputNumber style={{ width: "100%" }} />
            {descriptionNode}
          </Form.Item>
        );
      }
      // 默认文本
      return (
        <Form.Item
          key={name.join(".")}
          label={label}
          name={name}
          rules={[{ required: false }]}
        >
          <Input />
          {descriptionNode}
        </Form.Item>
      );
    });
  }

  // 初始化表单值
  useEffect(() => {
    if (value) {
      try {
        form.setFieldsValue(JSON.parse(value));
      } catch (e) {
        console.log(e);
        // ignore
      }
    }
    // eslint-disable-next-line
  }, [value]);

  const handleFinish = (values: Record<string, unknown>) => {
    setValue(JSON.stringify(values, null, 2));
  };

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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
          >
            {schema && renderFormItems(schema)}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          style={{
            flex: 1,
            background: "#f6f6f6",
            borderRadius: 8,
            padding: 24,
            overflow: "auto",
          }}
        >
          <h4>JSON 配置</h4>
          <Input.TextArea
            value={value}
            rows={24}
            readOnly
            style={{ fontFamily: "monospace" }}
          />
        </div>
      </div>
    </div>
  );
}
