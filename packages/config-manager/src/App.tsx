import { useState } from "react";
import { Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useVersions, type VersionItem } from "./hooks/useVersions";
import { createColumns } from "./components/tableColumns";
import { VersionDrawer } from "./components/VersionDrawer";

interface FormValues {
  [key: string]: any;
}

function App() {
  const { versions, createVersion, updateVersion, deleteVersion } =
    useVersions();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingVersion, setEditingVersion] = useState<VersionItem | null>(
    null
  );

  // 新建版本
  const handleCreate = () => {
    setEditingVersion(null);
    setDrawerVisible(true);
  };

  // 编辑版本
  const handleEdit = (version: VersionItem) => {
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
      updateVersion(editingVersion.id, {
        version: values.version,
        name: values.name,
        description: values.description,
      });
    } else {
      createVersion({
        version: values.version,
        name: values.name,
        description: values.description,
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

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>功能配置管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建版本
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={versions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

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
