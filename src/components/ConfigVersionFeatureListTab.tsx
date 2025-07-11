import React, { useEffect, useState } from "react";
import { Card, Form, Input, Switch, InputNumber, Select, Collapse } from "antd";
import MonacoJsonEditor from "./MonacoJsonEditor";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";
import { set } from "lodash-es";

const ConfigVersionFeatureListTab: React.FC = () => {
  const { versionSchema, defaultVersionConfig } = useDefineFeatureSchema();

  const [value, setValue] = useState(defaultVersionConfig);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(defaultVersionConfig);
  }, [defaultVersionConfig]);

  // 动态渲染 Form.Item，支持enabled、params、递归子级
  const renderFeatures = (features: any, parentKey = "features") => {
    if (!features) return null;
    return Object.entries(features).map(([key, schema]: [string, any]) => {
      const { title, description, properties = {} } = schema;
      const { params, enabled, ...childrenSchema } = properties;
      const featureKey = `${parentKey}.${key}`;
      const hasChildren = Object.keys(childrenSchema).length > 0;
      return (
        <Card
          key={key}
          size="small"
          type={parentKey !== "features" ? "inner" : undefined}
          style={{
            marginBottom: 12,
            background: parentKey !== "features" ? "#f6f8fa" : undefined,
            borderLeft:
              parentKey !== "features" ? "4px solid #1677ff" : undefined,
            boxShadow: parentKey === "features" ? "0 2px 8px #eee" : undefined,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: parentKey === "features" ? "#1677ff" : "#333",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              {hasChildren && (
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 16,
                    background: "#1677ff",
                    marginRight: 8,
                    borderRadius: 2,
                  }}
                />
              )}
              {title}{" "}
              <span style={{ color: "#999", fontWeight: 400, marginLeft: 4 }}>
                ({key})
              </span>
            </span>
            {/* 是否启用开关（antd Switch）与标题同行 */}
            {enabled && (
              <Form.Item
                name={[featureKey, "enabled"]}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            )}
          </div>
          <div
            style={{
              color: "#b0b0b0",
              fontSize: 12,
              marginBottom: 8,
              marginTop: 2,
            }}
          >
            {description}
          </div>
          {/* params参数面板：动态渲染每个参数，统一antd组件，更紧凑 */}
          {params && params.properties && (
            <Collapse
              style={{ marginBottom: 4 }}
              defaultActiveKey={[featureKey + "-params"]}
            >
              <Collapse.Panel
                header={
                  <span style={{ fontWeight: 500, color: "#1677ff" }}>
                    {params.title || "参数"}
                  </span>
                }
                key={featureKey + "-params"}
                style={{ background: "#f0f5ff", border: "1px solid #e6f7ff" }}
              >
                {params.description && (
                  <div
                    style={{
                      color: "#b0b0b0",
                      fontSize: 12,
                      marginBottom: 6,
                      marginTop: 0,
                    }}
                  >
                    {params.description}
                  </div>
                )}
                <div style={{ display: "grid", gap: 8 }}>
                  {Object.entries(params.properties).map(
                    ([pKey, pSchema]: [string, any]) => {
                      const itemName = [featureKey, "params", pKey];
                      const placeholder =
                        pSchema.description || pSchema.title || "";
                      if (pSchema.type === "string") {
                        return (
                          <Form.Item
                            key={pKey}
                            label={pSchema.title}
                            name={itemName}
                            tooltip={pSchema.description}
                            style={{ marginBottom: 4 }}
                          >
                            <Input placeholder={placeholder} />
                          </Form.Item>
                        );
                      }
                      if (pSchema.type === "number") {
                        return (
                          <Form.Item
                            key={pKey}
                            label={pSchema.title}
                            name={itemName}
                            tooltip={pSchema.description}
                            style={{ marginBottom: 4 }}
                          >
                            <InputNumber
                              min={pSchema.min}
                              max={pSchema.max}
                              style={{ width: "100%" }}
                              placeholder={placeholder}
                            />
                          </Form.Item>
                        );
                      }
                      if (
                        pSchema.type === "enum" &&
                        Array.isArray(pSchema.enum)
                      ) {
                        return (
                          <Form.Item
                            key={pKey}
                            label={pSchema.title}
                            name={itemName}
                            tooltip={pSchema.description}
                            style={{ marginBottom: 4 }}
                          >
                            <Select
                              style={{ width: "100%" }}
                              placeholder={placeholder}
                            >
                              {pSchema.enum.map((opt: any, idx: number) => {
                                const desc =
                                  pSchema.enumDescriptions &&
                                  pSchema.enumDescriptions[idx]
                                    ? pSchema.enumDescriptions[idx]
                                    : "";
                                return (
                                  <Select.Option key={opt} value={opt}>
                                    {desc ? `${desc} (${opt})` : opt}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </Collapse.Panel>
            </Collapse>
          )}
          {/* 递归渲染子级功能 */}
          {hasChildren && (
            <div
              style={{
                marginLeft: 16,
                borderLeft: "2px dashed #1677ff",
                paddingLeft: 12,
              }}
            >
              {renderFeatures(childrenSchema, featureKey)}
            </div>
          )}
        </Card>
      );
    });
  };
  return (
    <Card title="在线配置版本及功能清单" style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <MonacoJsonEditor
            schema={versionSchema}
            value={JSON.stringify(value, null, 2)}
            onChange={(val) => {
              const parsed = JSON.parse(val);
              setValue(parsed);
              form.setFieldsValue(parsed);
            }}
            height={400}
          />
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={value}
            onValuesChange={(changed, all) => {
              Object.entries(changed).forEach(([key, val]) => {
                set(value, key, val);
              });
              setValue({ ...value });
            }}
          >
            <Form.Item
              label="版本名称"
              name="name"
              rules={[{ required: true, message: "请输入版本名称" }]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="请输入版本名称" />
            </Form.Item>
            <Form.Item
              label="版本描述"
              name="description"
              style={{ marginBottom: 20 }}
            >
              <Input.TextArea rows={2} placeholder="请输入版本描述" />
            </Form.Item>
            {renderFeatures(versionSchema?.properties.features.properties)}
          </Form>
        </div>
      </div>
    </Card>
  );
};

export default ConfigVersionFeatureListTab;
