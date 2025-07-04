import React, { useMemo, useState } from "react";
import {
  Card,
  Tabs,
  Button,
  Space,
  message,
  Radio,
  Modal,
  Input,
  Form,
} from "antd";
import {
  DownloadOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import VersionForm from "./components/VersionForm";
import { createVersionSchema } from "../version/utils/schemaConverter";
import JsonEditor from "../version/components/JsonEditor";
import { useFeatureSchema, useVersions, VersionItem } from "../hooks";

type EditMode = "form" | "json";

const VersionPage: React.FC = () => {
  const [featureSchema] = useFeatureSchema();
  const [editMode, setEditMode] = useState<EditMode>("form");
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  // 使用 localStorage 存储版本列表
  const [versionList, setVersionList] = useVersions();

  // 当前活动版本
  const activeVersion = useMemo(() => {
    if (!activeVersionId || !versionList) return null;
    return versionList.find((v) => v.id === activeVersionId) || null;
  }, [activeVersionId, versionList]);

  // 根据 featureSchema 生成完整的 versionSchema
  const versionSchema = useMemo(() => {
    if (!featureSchema) {
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "版本配置",
        description: "完整的版本配置结构，包含版本信息和具体的功能配置",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      };
    }

    try {
      return createVersionSchema(featureSchema);
    } catch (error) {
      console.error("生成版本 Schema 失败:", error);
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "版本配置",
        description: "完整的版本配置结构，包含版本信息和具体的功能配置",
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      };
    }
  }, [featureSchema]);

  // 解析功能清单
  const parsedFeatureSchema = useMemo(() => {
    if (!featureSchema) return {};
    try {
      return typeof featureSchema === "string"
        ? JSON.parse(featureSchema)
        : featureSchema;
    } catch (error) {
      console.error("解析功能清单失败:", error);
      return {};
    }
  }, [featureSchema]);

  // 生成默认的版本配置数据
  const defaultVersionConfig = useMemo(() => {
    return (
      (versionSchema as any).example || {
        version: "1.0.0",
        name: "新版本",
        description: "版本描述",
        features: {},
      }
    );
  }, [versionSchema]);

  // 创建新版本
  const handleCreateVersion = async (values: {
    version: string;
    name: string;
    description: string;
  }) => {
    const newVersion: VersionItem = {
      id: Date.now().toString(),
      version: values.version,
      name: values.name,
      description: values.description,
      features: defaultVersionConfig.features || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newList = [...(versionList || []), newVersion];
    setVersionList(newList);
    setActiveVersionId(newVersion.id);
    setIsCreateModalOpen(false);
    createForm.resetFields();
    message.success("版本创建成功");
  };

  // 删除版本
  const handleDeleteVersion = (versionId: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个版本吗？删除后无法恢复。",
      okText: "确定",
      cancelText: "取消",
      onOk: () => {
        const newList = (versionList || []).filter((v) => v.id !== versionId);
        setVersionList(newList);

        // 如果删除的是当前活动版本，切换到第一个版本
        if (versionId === activeVersionId) {
          setActiveVersionId(newList.length > 0 ? newList[0].id : null);
        }

        message.success("版本删除成功");
      },
    });
  };

  // 处理表单数据变化
  const handleFormChange = (formData: any) => {
    if (!activeVersionId || !versionList) return;

    const newList = versionList.map((v) => {
      if (v.id === activeVersionId) {
        return {
          ...v,
          ...formData,
          updatedAt: new Date().toISOString(),
        };
      }
      return v;
    });

    setVersionList(newList);
  };

  // 处理 JSON 编辑器数据变化
  const handleJsonChange = (jsonString: string) => {
    if (!activeVersionId || !versionList) return;

    try {
      const configData = JSON.parse(jsonString);
      const newList = versionList.map((v) => {
        if (v.id === activeVersionId) {
          return {
            ...v,
            ...configData,
            updatedAt: new Date().toISOString(),
          };
        }
        return v;
      });

      setVersionList(newList);
    } catch (error) {
      console.error("JSON 解析失败:", error);
    }
  };

  // 重置当前版本配置
  const handleReset = () => {
    if (!activeVersionId || !versionList) return;

    const newList = versionList.map((v) => {
      if (v.id === activeVersionId) {
        return {
          ...v,
          features: defaultVersionConfig.features || {},
          updatedAt: new Date().toISOString(),
        };
      }
      return v;
    });

    setVersionList(newList);
    message.success("已重置为默认配置");
  };

  // 导出当前版本配置
  const handleExport = () => {
    if (!activeVersion) {
      message.error("请先选择一个版本");
      return;
    }

    try {
      const blob = new Blob([JSON.stringify(activeVersion, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = ["community", "enterprise"].includes(activeVersion.name)
        ? `${activeVersion.name}.json`
        : `${activeVersion.name}-${activeVersion.version}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success("配置已导出");
    } catch (error) {
      message.error("导出失败");
    }
  };

  // 导出所有版本
  const handleExportAll = () => {
    if (!versionList || versionList.length === 0) {
      message.error("没有可导出的版本");
      return;
    }

    try {
      const blob = new Blob([JSON.stringify(versionList, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `all-versions-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success("所有版本已导出");
    } catch (error) {
      message.error("导出失败");
    }
  };

  // 初始化第一个版本
  React.useEffect(() => {
    if (versionList && versionList.length > 0 && !activeVersionId) {
      setActiveVersionId(versionList[0].id);
    }
  }, [versionList, activeVersionId]);

  // 构建 Tab 项
  const tabItems = (versionList || []).map((version) => ({
    key: version.id,
    label: (
      <Space>
        <span>{version.version}</span>
        <span style={{ color: "#666", fontSize: "12px" }}>
          ({version.name})
        </span>
      </Space>
    ),
    children: (
      <div>
        <Card
          title={`版本 ${version.version} - ${version.name}`}
          extra={
            <Space>
              <Radio.Group
                value={editMode}
                onChange={(e) => setEditMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="form">可视化表单</Radio.Button>
                <Radio.Button value="json">JSON 编辑器</Radio.Button>
              </Radio.Group>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                type="default"
              >
                重置配置
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                type="primary"
              >
                导出配置
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteVersion(version.id)}
                danger
              >
                删除版本
              </Button>
            </Space>
          }
        >
          {editMode === "form" ? (
            <VersionForm
              featureSchema={parsedFeatureSchema}
              value={version}
              onChange={handleFormChange}
              isEditing={true}
            />
          ) : (
            <JsonEditor
              title=""
              value={JSON.stringify(
                {
                  version: version.version,
                  name: version.name,
                  description: version.description,
                  features: version.features,
                },
                null,
                2
              )}
              onChange={handleJsonChange}
              schema={versionSchema}
              height="600px"
            />
          )}
        </Card>
      </div>
    ),
  }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            新建版本
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportAll}
            disabled={!versionList || versionList.length === 0}
          >
            导出所有版本
          </Button>
        </Space>
      </div>

      {versionList && versionList.length > 0 ? (
        <Tabs
          type="card"
          hideAdd
          activeKey={activeVersionId || undefined}
          onChange={setActiveVersionId}
          items={tabItems}
        />
      ) : (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "#666" }}>
              暂无版本，点击"新建版本"创建第一个版本
            </p>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              新建版本
            </Button>
          </div>
        </Card>
      )}

      <Modal
        title="新建版本"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateVersion}
        >
          <Form.Item
            label="版本号"
            name="version"
            rules={[{ required: true, message: "请输入版本号" }]}
          >
            <Input placeholder="例如：1.0.0" />
          </Form.Item>
          <Form.Item
            label="版本名称"
            name="name"
            rules={[{ required: true, message: "请输入版本名称" }]}
          >
            <Input placeholder="例如：基础版本" />
          </Form.Item>
          <Form.Item label="版本描述" name="description">
            <Input.TextArea rows={3} placeholder="版本描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VersionPage;
