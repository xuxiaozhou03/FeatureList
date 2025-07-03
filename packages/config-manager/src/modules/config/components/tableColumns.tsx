import { Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import { VersionConfig } from "@feature-list/define";

export const createColumns = (
  onEdit: (version: VersionConfig) => void,
  onDelete: (id: string) => void
): ColumnType<VersionConfig>[] => [
  {
    title: "版本号",
    dataIndex: "version",
    key: "version",
    width: 120,
  },
  {
    title: "版本名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "操作",
    key: "action",
    width: 200,
    render: (_, record) => (
      <Space>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
        <Popconfirm
          title="确定删除这个版本吗？"
          onConfirm={() => onDelete(record.version)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];
