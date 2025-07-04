import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Switch,
  Select,
  InputNumber,
  Card,
  Button,
  Space,
  Collapse,
  Tag,
  Tooltip,
  message,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { FeatureConfig } from "../utils/schemaConverter";

const { Option } = Select;
const { TextArea } = Input;

interface VersionFormProps {
  featureSchema: Record<string, FeatureConfig>;
  value?: any;
  onChange?: (value: any) => void;
}

interface FeatureFormProps {
  feature: FeatureConfig;
  value?: any;
  onChange?: (value: any) => void;
  featureName: string;
}

const FeatureForm: React.FC<FeatureFormProps> = ({
  feature,
  value,
  onChange,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value);
    }
  }, [value, form]);

  const handleFormChange = (_: any, allValues: any) => {
    onChange?.(allValues);
  };

  const renderParamInput = (paramName: string, paramConfig: any) => {
    const {
      type,
      enum: enumValues,
      enumDescriptions,
      minimum,
      maximum,
      description,
    } = paramConfig;

    const getTooltip = () => {
      if (enumDescriptions && enumValues) {
        return (
          <div>
            <div>{description}</div>
            <div style={{ marginTop: 8 }}>
              {enumValues.map((value: string, index: number) => (
                <div key={value}>
                  <Tag color="blue">{value}</Tag>
                  {enumDescriptions[index]}
                </div>
              ))}
            </div>
          </div>
        );
      }
      return description;
    };

    const label = (
      <Space>
        {paramName}
        {(description || enumDescriptions) && (
          <Tooltip title={getTooltip()}>
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          </Tooltip>
        )}
      </Space>
    );

    switch (type) {
      case "string":
        if (enumValues) {
          return (
            <Form.Item name={["params", paramName]} label={label}>
              <Select placeholder={`请选择${paramName}`}>
                {enumValues.map((value: string, index: number) => (
                  <Option key={value} value={value}>
                    <Space>
                      {value}
                      {enumDescriptions?.[index] && (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          {enumDescriptions[index]}
                        </span>
                      )}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        return (
          <Form.Item name={["params", paramName]} label={label}>
            <Input placeholder={`请输入${paramName}`} />
          </Form.Item>
        );

      case "number":
        return (
          <Form.Item name={["params", paramName]} label={label}>
            <InputNumber
              style={{ width: "100%" }}
              min={minimum}
              max={maximum}
              placeholder={`请输入${paramName}`}
            />
          </Form.Item>
        );

      case "boolean":
        return (
          <Form.Item
            name={["params", paramName]}
            label={label}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        );

      case "array":
        if (paramConfig.items?.enum) {
          return (
            <Form.Item name={["params", paramName]} label={label}>
              <Select
                mode="multiple"
                placeholder={`请选择${paramName}`}
                style={{ width: "100%" }}
              >
                {paramConfig.items.enum.map((value: string, index: number) => (
                  <Option key={value} value={value}>
                    <Space>
                      {value}
                      {paramConfig.items.enumDescriptions?.[index] && (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          {paramConfig.items.enumDescriptions[index]}
                        </span>
                      )}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        return (
          <Form.Item name={["params", paramName]} label={label}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder={`请输入${paramName}`}
              tokenSeparators={[","]}
            />
          </Form.Item>
        );

      case "object":
        return (
          <Card size="small" title={label} style={{ marginBottom: 16 }}>
            {paramConfig.properties &&
              Object.entries(paramConfig.properties).map(
                ([propName, propConfig]: [string, any]) => (
                  <div key={propName}>
                    {renderParamInput(`${paramName}.${propName}`, propConfig)}
                  </div>
                )
              )}
          </Card>
        );

      default:
        return (
          <Form.Item name={["params", paramName]} label={label}>
            <Input placeholder={`请输入${paramName}`} />
          </Form.Item>
        );
    }
  };

  return (
    <Card
      title={
        <Space>
          <span>{feature.name}</span>
          {feature.description && (
            <Tooltip title={feature.description}>
              <InfoCircleOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          )}
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        initialValues={{
          enabled: true,
          params: {},
          children: {},
        }}
      >
        <Form.Item name="enabled" label="启用功能" valuePropName="checked">
          <Switch />
        </Form.Item>

        {feature.paramSchema && Object.keys(feature.paramSchema).length > 0 && (
          <Card title="参数配置" size="small" style={{ marginBottom: 16 }}>
            {Object.entries(feature.paramSchema).map(
              ([paramName, paramConfig]: [string, any]) =>
                renderParamInput(paramName, paramConfig)
            )}
          </Card>
        )}

        {feature.children && Object.keys(feature.children).length > 0 && (
          <Card title="子功能配置" size="small">
            <Collapse
              items={Object.entries(feature.children).map(
                ([childName, childFeature]: [string, any]) => ({
                  key: childName,
                  label: childFeature.name || childName,
                  children: (
                    <FeatureForm
                      feature={childFeature}
                      featureName={childName}
                      value={value?.children?.[childName]}
                      onChange={(childValue) => {
                        const newValue = { ...value };
                        if (!newValue.children) newValue.children = {};
                        newValue.children[childName] = childValue;
                        onChange?.(newValue);
                      }}
                    />
                  ),
                })
              )}
            />
          </Card>
        )}
      </Form>
    </Card>
  );
};

const VersionForm: React.FC<VersionFormProps> = ({
  featureSchema,
  value,
  onChange,
}) => {
  const [form] = Form.useForm();
  const [featureValues, setFeatureValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (value) {
      form.setFieldsValue({
        version: value.version,
        name: value.name,
        description: value.description,
      });
      setFeatureValues(value.features || {});
    }
  }, [value, form]);

  const handleBasicInfoChange = (_: any, allValues: any) => {
    const newValue = {
      ...allValues,
      features: featureValues,
    };
    onChange?.(newValue);
  };

  const handleFeatureChange = (featureName: string, featureValue: any) => {
    const newFeatureValues = {
      ...featureValues,
      [featureName]: featureValue,
    };
    setFeatureValues(newFeatureValues);

    const basicInfo = form.getFieldsValue();
    onChange?.({
      ...basicInfo,
      features: newFeatureValues,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFeatureValues({});
    onChange?.({
      version: "1.0.0",
      name: "",
      description: "",
      features: {},
    });
    message.success("表单已重置");
  };

  return (
    <div>
      <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleBasicInfoChange}
          initialValues={{
            version: "1.0.0",
            name: "",
            description: "",
          }}
        >
          <Form.Item
            name="version"
            label="版本号"
            rules={[
              { required: true, message: "请输入版本号" },
              { pattern: /^\d+\.\d+\.\d+$/, message: "版本号格式应为 x.y.z" },
            ]}
          >
            <Input placeholder="例如：1.0.0" />
          </Form.Item>

          <Form.Item
            name="name"
            label="版本名称"
            rules={[{ required: true, message: "请输入版本名称" }]}
          >
            <Input placeholder="请输入版本名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="版本描述"
            rules={[{ required: true, message: "请输入版本描述" }]}
          >
            <TextArea rows={3} placeholder="请输入版本描述" />
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="功能配置"
        size="small"
        extra={
          <Button onClick={handleReset} size="small">
            重置表单
          </Button>
        }
      >
        <Collapse
          items={Object.entries(featureSchema).map(
            ([featureName, feature]) => ({
              key: featureName,
              label: feature.name || featureName,
              children: (
                <FeatureForm
                  feature={feature}
                  featureName={featureName}
                  value={featureValues[featureName]}
                  onChange={(featureValue) =>
                    handleFeatureChange(featureName, featureValue)
                  }
                />
              ),
            })
          )}
        />
      </Card>
    </div>
  );
};

export default VersionForm;
