import React, { useState } from "react";
import { Button, Table, message, Popconfirm, Space, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { VersionDrawer } from "./VersionDrawer";
import { VersionConfig } from "@feature-list/define";
import { useVersions } from "../hooks/useVersions";

interface FormValues {
  [key: string]: any;
}

export const VersionManager: React.FC = () => {
  const {
    versions,
    createVersion,
    updateVersion,
    deleteVersion,
    reloadVersions,
    loading,
  } = useVersions();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingVersion, setEditingVersion] = useState<VersionConfig | null>(
    null
  );

  const handleCreate = () => {
    setEditingVersion(null);
    setDrawerVisible(true);
  };

  const handleEdit = (version: VersionConfig) => {
    setEditingVersion(version);
    setDrawerVisible(true);
  };

  const handleDelete = async (version: string) => {
    try {
      await deleteVersion(version);
      message.success("版本删除成功");
    } catch (error) {
      message.error("版本删除失败");
    }
  };

  const handleSave = async (values: FormValues) => {
    try {
      if (editingVersion) {
        await updateVersion(editingVersion.version, {
          name: values.name,
          description: values.description,
          features: values.features,
        });
        message.success("版本更新成功");
      } else {
        await createVersion({
          version: values.version,
          name: values.name,
          description: values.description,
          features: values.features || {},
        });
        message.success("版本创建成功");
      }
      setDrawerVisible(false);
      setEditingVersion(null);
    } catch (error) {
      message.error(editingVersion ? "版本更新失败" : "版本创建失败");
    }
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingVersion(null);
  };

  const columns = [
    {
      title: "版本号",
      dataIndex: "version",
      key: "version",
      render: (version: string) => (
        <Tag color="blue" className="font-mono">
          {version}
        </Tag>
      ),
    },
    {
      title: "版本名称",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="font-medium text-gray-900">{name}</span>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <span className="text-gray-600">{description}</span>
      ),
    },
    {
      title: "功能数量",
      dataIndex: "features",
      key: "featureCount",
      render: (features: any) => (
        <Tag color="green">
          {features ? Object.keys(features).length : 0} 个功能
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: VersionConfig) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-700"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个版本吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.version)}
            okText="删除"
            cancelText="取消"
            okType="danger"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-700"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 头部操作区 */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">版本管理</h3>
          <p className="text-sm text-gray-600">创建、编辑和管理配置版本</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={reloadVersions}
            loading={loading}
            className="flex items-center"
          >
            重新加载
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            className="flex items-center"
          >
            新建版本
          </Button>
        </Space>
      </div>

      {/* 版本列表 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          columns={columns}
          dataSource={versions}
          rowKey="version"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
          }}
          className="version-table"
        />
      </div>

      {/* 版本编辑抽屉 */}
      <VersionDrawer
        visible={drawerVisible}
        editingVersion={editingVersion}
        onClose={handleDrawerClose}
        onSave={handleSave}
      />
    </div>
  );
};
