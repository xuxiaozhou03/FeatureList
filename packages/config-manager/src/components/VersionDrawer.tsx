import { useState, useEffect } from "react";
import { Form, Button, Space, Drawer, Card } from "antd";
import { FormRenderer } from "./FormRenderer";
import { config, VersionConfig } from "@feature-list/define";

interface FormValues {
  [key: string]: any;
}

interface VersionDrawerProps {
  visible: boolean;
  editingVersion: VersionConfig | null;
  onClose: () => void;
  onSave: (values: FormValues) => void;
}

export const VersionDrawer: React.FC<VersionDrawerProps> = ({
  visible,
  editingVersion,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<FormValues>({});

  // 当抽屉打开或编辑版本改变时，设置表单初始值
  useEffect(() => {
    if (visible) {
      if (editingVersion) {
        // 编辑模式：设置现有版本的值
        form.setFieldsValue({
          version: editingVersion.version,
          name: editingVersion.name,
          description: editingVersion.description,
        });
      } else {
        // 新建模式：设置默认值
        form.resetFields();
        form.setFieldsValue({
          version: "1.0.0",
          name: "新版本",
          description: "版本描述",
        });
      }
    }
  }, [visible, editingVersion, form]);

  const handleSubmit = (values: FormValues) => {
    console.log("表单值:", values);
    setFormValues(values);
    onSave(values);
  };

  const handleSave = () => {
    form.submit();
  };

  return (
    <Drawer
      title={editingVersion ? "编辑版本" : "新建版本"}
      open={visible}
      onClose={onClose}
      width="80%"
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <FormRenderer items={config} />
      </Form>

      {Object.keys(formValues).length > 0 && (
        <Card title="当前配置" style={{ marginTop: 24 }}>
          <pre>{JSON.stringify(formValues, null, 2)}</pre>
        </Card>
      )}
    </Drawer>
  );
};
