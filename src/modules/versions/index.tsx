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
  Typography,
  Badge,
  Tooltip,
  Empty,
} from "antd";
import {
  DownloadOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CodeOutlined,
  SettingOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import VersionForm from "./components/VersionForm";
import { createVersionSchema } from "../version/utils/schemaConverter";
import JsonEditor from "../version/components/JsonEditor";
import { useFeatureSchema, useVersions, VersionItem } from "../hooks";
import "./styles.css";

const { Title, Paragraph, Text } = Typography;

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

  // 根据 parsedFeatureSchema 生成完整的功能配置
  const generateCompleteFeatures = (currentFeatures: any) => {
    if (!parsedFeatureSchema || Object.keys(parsedFeatureSchema).length === 0) {
      return currentFeatures;
    }

    const mergeFeatures = (
      schemaFeatures: any,
      currentFeatures: any = {}
    ): any => {
      const result: any = {};

      Object.keys(schemaFeatures).forEach((key) => {
        const schemaFeature = schemaFeatures[key];
        const currentFeature = currentFeatures[key] || {};

        if (schemaFeature && typeof schemaFeature === "object") {
          result[key] = {
            // 保持当前的启用状态，如果没有则使用 schema 中的默认值
            enabled:
              currentFeature.enabled !== undefined
                ? currentFeature.enabled
                : schemaFeature.enabled || false,

            // 合并参数，优先使用当前配置，缺失的参数使用 schema 默认值
            params: {
              ...schemaFeature.params,
              ...currentFeature.params,
            },
          };

          // 处理子功能
          if (
            schemaFeature.children &&
            typeof schemaFeature.children === "object"
          ) {
            result[key].children = mergeFeatures(
              schemaFeature.children,
              currentFeature.children
            );
          }
        }
      });

      return result;
    };

    return mergeFeatures(parsedFeatureSchema, currentFeatures);
  };

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
    // 生成完整的默认功能配置
    const completeDefaultFeatures = generateCompleteFeatures(
      defaultVersionConfig.features || {}
    );

    const newVersion: VersionItem = {
      id: Date.now().toString(),
      version: values.version,
      name: values.name,
      description: values.description,
      features: completeDefaultFeatures,
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

    // 生成完整的默认功能配置
    const completeDefaultFeatures = generateCompleteFeatures(
      defaultVersionConfig.features || {}
    );

    const newList = versionList.map((v) => {
      if (v.id === activeVersionId) {
        return {
          ...v,
          features: completeDefaultFeatures,
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
      // 生成完整的功能配置
      const completeFeatures = generateCompleteFeatures(activeVersion.features);

      // 创建完整的导出数据
      const exportData = {
        id: activeVersion.id,
        version: activeVersion.version,
        name: activeVersion.name,
        description: activeVersion.description,
        features: completeFeatures,
        createdAt: activeVersion.createdAt,
        updatedAt: activeVersion.updatedAt,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
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
      // 为每个版本生成完整的功能配置
      const completeVersionList = versionList.map((version) => ({
        id: version.id,
        version: version.version,
        name: version.name,
        description: version.description,
        features: generateCompleteFeatures(version.features),
        createdAt: version.createdAt,
        updatedAt: version.updatedAt,
      }));

      const blob = new Blob([JSON.stringify(completeVersionList, null, 2)], {
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
      <div className="flex items-center gap-2">
        <Badge
          color={version.name === "enterprise" ? "gold" : "blue"}
          size="small"
        />
        <span>{version.name}</span>
        <Text type="secondary" className="text-xs">
          v{version.version}
        </Text>
      </div>
    ),
    children: (
      <div className="version-tab-content">
        {/* 版本信息卡片 */}
        <Card className="version-info-card mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SettingOutlined className="text-white text-xl" />
              </div>
              <div>
                <Title level={4} className="mb-1">
                  {version.name} <Badge text={`v${version.version}`} />
                </Title>
                <Paragraph className="text-gray-600 mb-2">
                  {version.description || "暂无描述"}
                </Paragraph>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarOutlined />
                    创建于: {new Date(version.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <EditOutlined />
                    更新于: {new Date(version.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip title="重置配置">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  size="small"
                />
              </Tooltip>
              <Tooltip title="导出配置">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  size="small"
                />
              </Tooltip>
              <Tooltip title="删除版本">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteVersion(version.id)}
                  size="small"
                  danger
                />
              </Tooltip>
            </div>
          </div>
        </Card>

        {/* 编辑模式切换 */}
        <Card className="mb-6 shadow-md border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Text strong>编辑模式:</Text>
              <Radio.Group
                value={editMode}
                onChange={(e) => setEditMode(e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="form">
                  <EditOutlined /> 表单模式
                </Radio.Button>
                <Radio.Button value="json">
                  <CodeOutlined /> JSON 模式
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Card>

        {/* 编辑器内容 */}
        <Card className="editor-card shadow-lg border-0 rounded-xl overflow-hidden">
          {editMode === "form" ? (
            <VersionForm
              featureSchema={parsedFeatureSchema}
              value={version}
              onChange={handleFormChange}
              isEditing={true}
            />
          ) : (
            <JsonEditor
              title="版本配置 JSON"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            版本管理
          </Title>
          <Paragraph className="text-gray-600 text-lg">
            创建和管理不同的版本配置，支持表单编辑和 JSON 编辑两种模式
          </Paragraph>
        </div>

        {/* 操作按钮 */}
        <div className="mb-6">
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              新建版本
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportAll}
              disabled={!versionList || versionList.length === 0}
              className="shadow-md hover:shadow-lg transition-all duration-300"
            >
              导出所有版本
            </Button>
          </Space>
        </div>

        {/* 版本列表 */}
        {versionList && versionList.length > 0 ? (
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden backdrop-blur-sm bg-white/90">
            <Tabs
              type="card"
              hideAdd
              activeKey={activeVersionId || undefined}
              onChange={setActiveVersionId}
              items={tabItems}
              className="versions-tabs"
            />
          </Card>
        ) : (
          <Card className="shadow-lg border-0 rounded-xl text-center py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text type="secondary" className="text-lg">
                    暂无版本配置
                  </Text>
                  <br />
                  <Text type="secondary">
                    点击"新建版本"创建您的第一个版本配置
                  </Text>
                </div>
              }
            >
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                新建版本
              </Button>
            </Empty>
          </Card>
        )}

        {/* 创建版本对话框 */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <PlusOutlined />
              新建版本
            </div>
          }
          open={isCreateModalOpen}
          onCancel={() => {
            setIsCreateModalOpen(false);
            createForm.resetFields();
          }}
          onOk={() => createForm.submit()}
          okText="创建"
          cancelText="取消"
          className="create-version-modal"
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
    </div>
  );
};

export default VersionPage;
