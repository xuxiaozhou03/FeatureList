import React, { useMemo, useState } from "react";
import {
  Button,
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
  CalendarOutlined,
} from "@ant-design/icons";
import VersionForm from "./components/VersionForm";
import { createVersionSchema } from "../schema/utils/schemaConverter";
import JsonEditor from "../schema/components/JsonEditor";
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

  return (
    <div className="version-management min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">版本管理</h1>
              <p className="text-sm text-gray-600">
                创建和管理不同的版本配置，支持表单编辑和 JSON 编辑两种模式
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 border-0 transition-colors text-sm"
              >
                新建版本
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportAll}
                disabled={!versionList || versionList.length === 0}
                className="text-sm"
              >
                导出所有版本
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* 左侧版本列表 */}
          <div className="col-span-4">
            <div className="version-list-panel bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    版本列表
                  </h3>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    size="small"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 border-0"
                  >
                    新建
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    icon={<DownloadOutlined />}
                    size="small"
                    onClick={handleExportAll}
                    disabled={!versionList || versionList.length === 0}
                    className="flex-1"
                  >
                    导出全部
                  </Button>
                </div>
              </div>

              <div className="p-4">
                {versionList && versionList.length > 0 ? (
                  <div className="space-y-3">
                    {versionList.map((version) => (
                      <div
                        key={version.id}
                        onClick={() => setActiveVersionId(version.id)}
                        className={`version-card p-4 cursor-pointer ${
                          activeVersionId === version.id ? "active" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                color={
                                  version.name === "enterprise"
                                    ? "#f59e0b"
                                    : "#3b82f6"
                                }
                                size="default"
                              />
                              <h4 className="font-medium text-gray-900 truncate">
                                {version.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                v{version.version}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  version.updatedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {version.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {version.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Tooltip title="导出配置">
                              <Button
                                icon={<DownloadOutlined />}
                                size="small"
                                type="text"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVersionId(version.id);
                                  setTimeout(() => handleExport(), 100);
                                }}
                                className="text-gray-400 hover:text-green-600"
                              />
                            </Tooltip>
                            <Tooltip title="删除版本">
                              <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                type="text"
                                danger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteVersion(version.id);
                                }}
                                className="text-gray-400 hover:text-red-600"
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      imageStyle={{ height: 48 }}
                      description={
                        <div>
                          <Text type="secondary" className="text-sm">
                            暂无版本配置
                          </Text>
                        </div>
                      }
                    >
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        size="small"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 border-0"
                      >
                        创建第一个版本
                      </Button>
                    </Empty>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧版本详细配置 */}
          <div className="col-span-8">
            {activeVersion ? (
              <div className="version-detail-panel bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                {/* 版本信息头部 */}
                <div className="version-info-header p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                        <SettingOutlined className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Title level={4} className="mb-0 text-gray-900">
                            {activeVersion.name}
                          </Title>
                          <Badge
                            count={`v${activeVersion.version}`}
                            style={{
                              backgroundColor: "#3b82f6",
                              fontSize: "11px",
                              fontWeight: "500",
                            }}
                          />
                        </div>
                        <Paragraph className="text-gray-700 mb-3 text-sm">
                          {activeVersion.description || "暂无描述"}
                        </Paragraph>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarOutlined className="text-blue-500" />
                            创建于{" "}
                            {new Date(
                              activeVersion.createdAt
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <EditOutlined className="text-green-500" />
                            更新于{" "}
                            {new Date(
                              activeVersion.updatedAt
                            ).toLocaleDateString()}
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
                          className="border-gray-300 hover:border-blue-400 hover:text-blue-600"
                        />
                      </Tooltip>
                      <Tooltip title="导出配置">
                        <Button
                          icon={<DownloadOutlined />}
                          onClick={handleExport}
                          size="small"
                          className="border-gray-300 hover:border-green-400 hover:text-green-600"
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* 编辑模式切换 */}
                <div className="edit-mode-section p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Text strong className="text-sm text-gray-900">
                      编辑模式
                    </Text>
                    <Radio.Group
                      value={editMode}
                      onChange={(e) => setEditMode(e.target.value)}
                      buttonStyle="solid"
                      size="middle"
                      className="edit-mode-radio"
                    >
                      <Radio.Button value="form" className="px-4">
                        <EditOutlined className="mr-1" />
                        表单模式
                      </Radio.Button>
                      <Radio.Button value="json" className="px-4">
                        <CodeOutlined className="mr-1" />
                        JSON 模式
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>

                {/* 编辑器内容 */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full p-6">
                    {editMode === "form" ? (
                      <VersionForm
                        featureSchema={parsedFeatureSchema}
                        value={activeVersion}
                        onChange={handleFormChange}
                        isEditing={true}
                      />
                    ) : (
                      <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                        <JsonEditor
                          value={JSON.stringify(
                            {
                              version: activeVersion.version,
                              name: activeVersion.name,
                              description: activeVersion.description,
                              features: activeVersion.features,
                            },
                            null,
                            2
                          )}
                          onChange={handleJsonChange}
                          schema={versionSchema}
                          height="600px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    imageStyle={{ height: 60 }}
                    description={
                      <div>
                        <Text type="secondary" className="text-base">
                          请选择一个版本进行配置
                        </Text>
                      </div>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

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
