import { useState } from "react";
import { Button, Table, Tabs } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useVersions } from "./hooks/useVersions";
import { createColumns } from "./components/tableColumns";
import { VersionDrawer } from "./components/VersionDrawer";
import { VersionLoader } from "./components/VersionLoader";
import { ConfigDemo } from "./components/ConfigDemo";
import { VersionConfig } from "@feature-list/define";

interface FormValues {
  [key: string]: any;
}

function App() {
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

  // 新建版本
  const handleCreate = () => {
    setEditingVersion(null);
    setDrawerVisible(true);
  };

  // 编辑版本
  const handleEdit = (version: VersionConfig) => {
    setEditingVersion(version);
    setDrawerVisible(true);
  };

  // 删除版本
  const handleDelete = (id: string) => {
    deleteVersion(id);
  };

  // 保存版本
  const handleSave = (values: FormValues) => {
    if (editingVersion) {
      updateVersion(editingVersion.version, {
        name: values.name,
        description: values.description,
      });
    } else {
      createVersion({
        version: values.version,
        name: values.name,
        description: values.description,
        features: values.features || [],
      });
    }
    setDrawerVisible(false);
    setEditingVersion(null);
  };

  // 关闭抽屉
  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingVersion(null);
  };

  const columns = createColumns(handleEdit, handleDelete);

  const tabItems = [
    {
      key: "1",
      label: "版本管理",
      children: (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新建版本
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={reloadVersions}
                loading={loading}
              >
                重新加载
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={versions}
            rowKey="version"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "JSON 配置预览",
      children: <VersionLoader />,
    },
    {
      key: "3",
      label: "配置演示",
      children: <ConfigDemo />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>功能配置管理</h1>

      <Tabs defaultActiveKey="1" items={tabItems} />

      <VersionDrawer
        visible={drawerVisible}
        editingVersion={editingVersion}
        onClose={handleDrawerClose}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
