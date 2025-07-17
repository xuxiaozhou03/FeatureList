/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useVersionList } from "../hooks/useVersionList";
import {
  Input,
  Button,
  List,
  Typography,
  Popconfirm,
  message,
  Form,
  Drawer,
} from "antd";
import useFeatureSchema from "../hooks/useFeatureSchema";
import type { VersionItem } from "../type";
import ConfigVersion from "./ConfigVersion";

// 下载版本为 JSON 文件
function downloadVersion(v: VersionItem) {
  const data = JSON.stringify(v, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${v.name || "version"}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

const VersionList: React.FC = () => {
  const { schema, defaultValue } = useFeatureSchema();
  const { versions, addVersion, updateVersion, deleteVersion } =
    useVersionList();

  const [form] = Form.useForm();
  const [showForm, setShowForm] = useState(false);
  const [editConfig, setEditConfig] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // 打开新增表单
  const openAdd = () => {
    setEditId(null);
    form.setFieldsValue({ name: "", desc: "" });
    setEditConfig(defaultValue);
    setShowForm(true);
  };

  // 打开编辑表单
  const openEdit = (v: any) => {
    setEditId(v.id);
    form.setFieldsValue({ name: v.name, desc: v.desc });
    setEditConfig(v.features);
    setShowForm(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (!editConfig) {
      message.warning("请填写功能清单配置");
      return;
    }
    if (editId) {
      updateVersion(editId, values.name, values.desc, editConfig);
      message.success("编辑成功");
    } else {
      addVersion(values.name, values.desc, editConfig);
      message.success("新建成功");
    }
    setShowForm(false);
    setEditId(null);
    setEditConfig(null);
    form.resetFields();
  };

  // 递归统计已开启功能数
  function countEnabledFeatures(obj: any): number {
    if (!obj || typeof obj !== "object") return 0;
    let count = 0;
    if (obj.enabled === true) count += 1;
    for (const key in obj) {
      if (key !== "enabled" && typeof obj[key] === "object") {
        count += countEnabledFeatures(obj[key]);
      }
    }
    return count;
  }

  return (
    <div className="flex-1 bg-white rounded-lg p-4 shadow">
      <h4 className="mb-4 font-semibold flex">
        <span className="flex-1">版本列表</span>
        <Button type="primary" onClick={openAdd} style={{ marginBottom: 16 }}>
          新建版本
        </Button>
      </h4>

      <List
        bordered
        dataSource={versions}
        locale={{
          emptyText: <span className="text-gray-400">暂无版本数据</span>,
        }}
        renderItem={(v) => {
          const enabledCount = countEnabledFeatures(v.features);
          return (
            <List.Item
              actions={[
                <Typography.Link onClick={() => openEdit(v)} key="edit">
                  编辑
                </Typography.Link>,
                <span key="download">
                  <Typography.Link onClick={() => downloadVersion(v)}>
                    下载
                  </Typography.Link>
                </span>,
                <Popconfirm
                  title="确定要删除该版本吗?"
                  onConfirm={() => {
                    deleteVersion(v.id);
                    message.success("删除成功");
                  }}
                  okText="删除"
                  cancelText="取消"
                  key="delete"
                >
                  <Typography.Link type="danger">删除</Typography.Link>
                </Popconfirm>,
              ]}
            >
              <div>
                <div
                  style={{
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span>{v.name}</span>
                  <span
                    style={{
                      color: "#52c41a",
                      fontSize: 12,
                      background: "#f6ffed",
                      borderRadius: 4,
                      padding: "0 8px",
                    }}
                  >
                    已开启功能数：{enabledCount}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#999" }}>{v.desc}</div>
                <div style={{ fontSize: 12, color: "#bbb" }}>
                  {new Date(v.createdAt).toLocaleString()}
                </div>
              </div>
            </List.Item>
          );
        }}
        style={{ background: "#fff", borderRadius: 8 }}
      />
      <Drawer
        open={showForm}
        title={editId ? "编辑版本" : "新建版本"}
        onClose={() => {
          setShowForm(false);
          setEditId(null);
          setEditConfig(null);
          form.resetFields();
        }}
        width={"80vw"}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setEditConfig(null);
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              {editId ? "保存" : "新建"}
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: "", desc: "" }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              label="版本名称"
              name="name"
              rules={[{ required: true, message: "请输入版本名称" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入版本名称" />
            </Form.Item>
            <Form.Item label="描述" name="desc" style={{ flex: 1 }}>
              <Input placeholder="请输入描述" />
            </Form.Item>
          </div>
        </Form>
        <div style={{ marginTop: 16 }}>
          {schema && (
            <ConfigVersion
              schema={schema}
              value={editConfig}
              setValue={setEditConfig}
            />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default VersionList;
