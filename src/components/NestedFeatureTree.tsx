import React, { useState, useCallback } from "react";
import {
  Tree,
  Card,
  Button,
  Space,
  Dropdown,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Tooltip,
} from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
  FolderOutlined,
  FileOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { FeatureConfig, FeatureTreeNode } from "@/types";
import { nestedFeatureUtils } from "@/utils";
import styles from "./NestedFeatureTree.module.css";

const { Option } = Select;

interface NestedFeatureTreeProps {
  /** 功能列表 */
  features: FeatureConfig[];
  /** 选中的功能 */
  selectedFeatures?: string[];
  /** 是否只读模式 */
  readonly?: boolean;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 功能变更回调 */
  onChange?: (features: FeatureConfig[]) => void;
  /** 功能选择回调 */
  onSelect?: (
    selectedKeys: string[],
    selectedFeatures: FeatureConfig[]
  ) => void;
}

const NestedFeatureTree: React.FC<NestedFeatureTreeProps> = ({
  features,
  selectedFeatures = [],
  readonly = false,
  showActions = true,
  draggable = false,
  onChange,
  onSelect,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(selectedFeatures);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureConfig | null>(
    null
  );
  const [parentId, setParentId] = useState<string | undefined>();
  const [form] = Form.useForm();

  // 构建树形数据
  const buildTreeData = useCallback(
    (featureList: FeatureConfig[]): TreeDataNode[] => {
      const tree = nestedFeatureUtils.buildFeatureTree(featureList);

      const convertToTreeData = (nodes: FeatureTreeNode[]): TreeDataNode[] => {
        return nodes.map((node) => ({
          key: node.id,
          title: (
            <div className={styles.treeNodeTitle}>
              <div className={styles.nodeInfo}>
                {node.type === "group" ? (
                  <FolderOutlined style={{ color: node.color || "#1890ff" }} />
                ) : (
                  <FileOutlined
                    style={{ color: getFeatureTypeColor(node.type) }}
                  />
                )}
                <span className={styles.nodeName}>{node.name}</span>
                <Tag
                  size="small"
                  color={getFeatureTypeColor(node.type)}
                  className={styles.nodeTag}
                >
                  {node.type}
                </Tag>
                {!node.defaultEnabled && (
                  <Tag size="small" color="default">
                    禁用
                  </Tag>
                )}
              </div>
              {showActions && !readonly && (
                <div className={styles.nodeActions}>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "addChild",
                          label: "添加子功能",
                          icon: <PlusOutlined />,
                          onClick: () => handleAddChild(node.id),
                        },
                        {
                          key: "edit",
                          label: "编辑",
                          icon: <EditOutlined />,
                          onClick: () => handleEdit(node),
                        },
                        {
                          type: "divider",
                        },
                        {
                          key: "delete",
                          label: "删除",
                          icon: <DeleteOutlined />,
                          danger: true,
                          onClick: () => handleDelete(node.id, node.name),
                        },
                      ],
                    }}
                    trigger={["click"]}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<EllipsisOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                </div>
              )}
            </div>
          ),
          children:
            node.children.length > 0
              ? convertToTreeData(node.children)
              : undefined,
          isLeaf: node.isLeaf,
          disabled: readonly,
        }));
      };

      return convertToTreeData(tree);
    },
    [showActions, readonly]
  );

  // 获取功能类型颜色
  const getFeatureTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      feature: "#1890ff",
      experiment: "#faad14",
      rollout: "#52c41a",
      permission: "#722ed1",
      group: "#13c2c2",
    };
    return colorMap[type] || "#d9d9d9";
  };

  // 处理树节点展开/收起
  const handleExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys as string[]);
  };

  // 处理节点选择
  const handleSelect = (keys: React.Key[], info: any) => {
    const selectedIds = keys as string[];
    setSelectedKeys(selectedIds);

    if (onSelect) {
      const selectedFeatureList = features.filter((f) =>
        selectedIds.includes(f.id)
      );
      onSelect(selectedIds, selectedFeatureList);
    }
  };

  // 处理拖拽
  const handleDrop: TreeProps["onDrop"] = (info) => {
    if (!draggable || readonly) return;

    const dropKey = info.node.key as string;
    const dragKey = info.dragNode.key as string;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // 确定新的父节点
    let newParentId: string | undefined;
    if (dropPosition === 0) {
      // 放置在节点内部，成为子节点
      newParentId = dropKey;
    } else {
      // 放置在节点同级
      const dropFeature = features.find((f) => f.id === dropKey);
      newParentId = dropFeature?.parentId;
    }

    // 移动功能
    const newFeatures = nestedFeatureUtils.moveFeature(
      features,
      dragKey,
      newParentId
    );
    onChange?.(newFeatures);
    message.success("功能移动成功");
  };

  // 添加子功能
  const handleAddChild = (parentFeatureId: string) => {
    setParentId(parentFeatureId);
    setEditingFeature(null);
    form.resetFields();
    setEditModalVisible(true);
  };

  // 编辑功能
  const handleEdit = (feature: FeatureConfig) => {
    setEditingFeature(feature);
    setParentId(feature.parentId);
    form.setFieldsValue({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      type: feature.type,
      defaultEnabled: feature.defaultEnabled,
      icon: feature.icon,
      color: feature.color,
    });
    setEditModalVisible(true);
  };

  // 删除功能
  const handleDelete = (featureId: string, featureName: string) => {
    Modal.confirm({
      title: "确认删除",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除功能"${featureName}"吗？此操作将同时删除所有子功能。`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        // 获取要删除的功能及其所有子功能
        const toDelete = [
          featureId,
          ...nestedFeatureUtils
            .getChildFeatures(featureId, features)
            .map((f) => f.id),
        ];
        const newFeatures = features.filter((f) => !toDelete.includes(f.id));
        onChange?.(newFeatures);
        message.success("删除成功");
      },
    });
  };

  // 保存功能
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const now = new Date().toISOString();
      const featureData: FeatureConfig = {
        ...values,
        parentId,
        level: parentId
          ? (features.find((f) => f.id === parentId)?.level ?? 0) + 1
          : 0,
        createdAt: editingFeature?.createdAt || now,
        updatedAt: now,
      };

      let newFeatures: FeatureConfig[];
      if (editingFeature) {
        // 更新现有功能
        newFeatures = features.map((f) =>
          f.id === editingFeature.id ? featureData : f
        );
      } else {
        // 添加新功能
        newFeatures = [...features, featureData];
      }

      onChange?.(newFeatures);
      setEditModalVisible(false);
      message.success(editingFeature ? "更新成功" : "添加成功");
    } catch (error) {
      // 表单验证失败
    }
  };

  const treeData = buildTreeData(features);

  return (
    <div className={styles.nestedFeatureTree}>
      <Card
        title="功能清单树"
        extra={
          !readonly && (
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setParentId(undefined);
                  setEditingFeature(null);
                  form.resetFields();
                  setEditModalVisible(true);
                }}
              >
                添加根功能
              </Button>
            </Space>
          )
        }
      >
        <Tree
          showLine={true}
          showIcon={false}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          treeData={treeData}
          onExpand={handleExpand}
          onSelect={handleSelect}
          draggable={draggable && !readonly}
          onDrop={handleDrop}
          className={styles.tree}
        />
      </Card>

      {/* 编辑功能模态框 */}
      <Modal
        title={editingFeature ? "编辑功能" : "添加功能"}
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => setEditModalVisible(false)}
        destroyOnClose
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: "feature",
            defaultEnabled: true,
          }}
        >
          <Form.Item
            label="功能ID"
            name="id"
            rules={[
              { required: true, message: "请输入功能ID" },
              { pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, message: "ID格式不正确" },
            ]}
          >
            <Input placeholder="feature-id" disabled={!!editingFeature} />
          </Form.Item>

          <Form.Item
            label="功能名称"
            name="name"
            rules={[{ required: true, message: "请输入功能名称" }]}
          >
            <Input placeholder="请输入功能名称" />
          </Form.Item>

          <Form.Item label="功能描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入功能描述" />
          </Form.Item>

          <Form.Item
            label="功能类型"
            name="type"
            rules={[{ required: true, message: "请选择功能类型" }]}
          >
            <Select placeholder="请选择功能类型">
              <Option value="feature">功能特性</Option>
              <Option value="experiment">实验功能</Option>
              <Option value="rollout">灰度发布</Option>
              <Option value="permission">权限控制</Option>
              <Option value="group">功能分组</Option>
            </Select>
          </Form.Item>

          <Form.Item label="图标" name="icon">
            <Input placeholder="功能图标名称" />
          </Form.Item>

          <Form.Item label="颜色" name="color">
            <Input type="color" style={{ width: 100 }} />
          </Form.Item>

          <Form.Item
            label="默认启用"
            name="defaultEnabled"
            valuePropName="checked"
          >
            <input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NestedFeatureTree;
