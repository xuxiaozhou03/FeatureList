import { Form, Input, InputNumber, Switch, Card, Divider } from "antd";

interface FormRenderProps {
  items: any[];
  prefix?: string;
}

export const FormRenderer: React.FC<FormRenderProps> = ({
  items,
  prefix = "",
}) => {
  const renderFormItems = (items: any[], prefix = ""): React.ReactNode[] => {
    return items.map((item) => {
      const fieldName = prefix ? `${prefix}.${item.name}` : item.name;
      const fieldNameArray = fieldName.split(".");

      // 基础字段（string, number）
      if (item.type === "string") {
        return (
          <Form.Item
            key={fieldName}
            name={fieldNameArray}
            label={item.label}
            rules={
              item.required !== false
                ? [{ required: true, message: `请输入${item.label}` }]
                : []
            }
          >
            <Input placeholder={`请输入${item.label}`} />
          </Form.Item>
        );
      }

      if (item.type === "number") {
        return (
          <Form.Item
            key={fieldName}
            name={fieldNameArray}
            label={item.label}
            rules={
              item.required !== false
                ? [{ required: true, message: `请输入${item.label}` }]
                : []
            }
          >
            <InputNumber
              placeholder={`请输入${item.label}`}
              style={{ width: "100%" }}
              min={item.label.includes("[1, 100]") ? 1 : undefined}
              max={item.label.includes("[1, 100]") ? 100 : undefined}
            />
          </Form.Item>
        );
      }

      if (item.type === "boolean") {
        return (
          <Form.Item
            key={fieldName}
            name={fieldNameArray}
            label={item.label}
            valuePropName="checked"
            rules={
              item.required !== false
                ? [{ required: true, message: `请设置${item.label}` }]
                : []
            }
          >
            <Switch />
          </Form.Item>
        );
      }

      // 特殊处理 Features 字段 - 只显示标题，不用卡片
      if (item.name === "features" && item.children) {
        return (
          <div className="ant-form-item" key={fieldName}>
            <div className="ant-row ant-form-item-row">
              <div className="ant-col ant-form-item-label">
                <label
                  title={item.label}
                  htmlFor="features"
                  className="ant-form-item-required"
                >
                  {item.label}
                </label>
              </div>
              <div id="features" className="ant-col ant-form-item-control">
                {item.children.map((feature: any) => {
                  // 渲染每个功能模块
                  return renderFormItems([feature], fieldName);
                })}
              </div>
            </div>
          </div>
        );
      }

      // 有子项的字段
      if (item.children) {
        return (
          <Form.Item
            key={fieldName}
            noStyle
            shouldUpdate={(prevValues, currentValues) => {
              const prevEnabled = prevValues?.features?.[item.name]?.enabled;
              const currentEnabled =
                currentValues?.features?.[item.name]?.enabled;
              return prevEnabled !== currentEnabled;
            }}
          >
            {({ getFieldValue }) => {
              const isEnabled = getFieldValue([...fieldNameArray, "enabled"]);

              return (
                <Card
                  title={item.label}
                  style={{ marginBottom: 16 }}
                  size="small"
                  styles={{
                    body: !isEnabled ? { display: "none" } : {},
                  }}
                  extra={
                    <Form.Item
                      name={[...fieldNameArray, "enabled"]}
                      valuePropName="checked"
                      style={{ margin: 0 }}
                    >
                      <Switch
                        checkedChildren="启用"
                        unCheckedChildren="关闭"
                        size="small"
                      />
                    </Form.Item>
                  }
                >
                  {isEnabled && (
                    <>
                      {/* 父级功能的参数配置 */}
                      {item.params && item.params.length > 0 && (
                        <>
                          <Divider
                            orientation="left"
                            style={{ margin: "12px 0" }}
                          >
                            {item.label} 配置
                          </Divider>
                          {renderFormItems(item.params, `${fieldName}.params`)}
                        </>
                      )}

                      {/* 子功能配置 */}
                      {item.children.length > 0 && (
                        <>
                          <Divider
                            orientation="left"
                            style={{ margin: "12px 0" }}
                          >
                            子功能配置
                          </Divider>
                          {item.children.map((child: any) => (
                            <Form.Item
                              key={`${fieldName}.${child.name}`}
                              noStyle
                              shouldUpdate={(prevValues, currentValues) => {
                                const prevChildEnabled =
                                  prevValues?.features?.[item.name]?.[
                                    child.name
                                  ]?.enabled;
                                const currentChildEnabled =
                                  currentValues?.features?.[item.name]?.[
                                    child.name
                                  ]?.enabled;
                                return prevChildEnabled !== currentChildEnabled;
                              }}
                            >
                              {({ getFieldValue }) => {
                                const isChildEnabled = getFieldValue([
                                  ...fieldNameArray,
                                  child.name,
                                  "enabled",
                                ]);

                                return (
                                  <Card
                                    title={child.label}
                                    style={{ marginBottom: 12 }}
                                    size="small"
                                    type="inner"
                                    styles={{
                                      body: !isChildEnabled
                                        ? { display: "none" }
                                        : {},
                                    }}
                                    extra={
                                      <Form.Item
                                        name={[
                                          ...fieldNameArray,
                                          child.name,
                                          "enabled",
                                        ]}
                                        valuePropName="checked"
                                        style={{ margin: 0 }}
                                      >
                                        <Switch
                                          checkedChildren="启用"
                                          unCheckedChildren="关闭"
                                          size="small"
                                        />
                                      </Form.Item>
                                    }
                                  >
                                    {isChildEnabled &&
                                      child.params &&
                                      child.params.length > 0 && (
                                        <>
                                          <Divider
                                            orientation="left"
                                            style={{ margin: "12px 0" }}
                                          >
                                            参数配置
                                          </Divider>
                                          {renderFormItems(
                                            child.params,
                                            `${fieldName}.${child.name}.params`
                                          )}
                                        </>
                                      )}
                                  </Card>
                                );
                              }}
                            </Form.Item>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </Card>
              );
            }}
          </Form.Item>
        );
      }

      // 有参数的字段
      if (item.params) {
        return (
          <Form.Item
            key={fieldName}
            noStyle
            shouldUpdate={(prevValues, currentValues) => {
              const prevEnabled = prevValues?.features?.[item.name]?.enabled;
              const currentEnabled =
                currentValues?.features?.[item.name]?.enabled;
              return prevEnabled !== currentEnabled;
            }}
          >
            {({ getFieldValue }) => {
              const isEnabled = getFieldValue([...fieldNameArray, "enabled"]);

              return (
                <Card
                  title={item.label}
                  style={{ marginBottom: 16 }}
                  size="small"
                  styles={{
                    body: !isEnabled ? { display: "none" } : {},
                  }}
                  extra={
                    <Form.Item
                      name={[...fieldNameArray, "enabled"]}
                      valuePropName="checked"
                      style={{ margin: 0 }}
                    >
                      <Switch
                        checkedChildren="启用"
                        unCheckedChildren="关闭"
                        size="small"
                      />
                    </Form.Item>
                  }
                >
                  {isEnabled && item.params.length > 0 && (
                    <>
                      <Divider orientation="left" style={{ margin: "12px 0" }}>
                        参数配置
                      </Divider>
                      {renderFormItems(item.params, `${fieldName}.params`)}
                    </>
                  )}
                </Card>
              );
            }}
          </Form.Item>
        );
      }

      return null;
    });
  };

  return <>{renderFormItems(items, prefix)}</>;
};
