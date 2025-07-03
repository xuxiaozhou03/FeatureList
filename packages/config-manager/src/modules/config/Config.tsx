import React from "react";
import { Card, Tabs } from "antd";
import {
  SettingOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { VersionManager } from "./components/VersionManager";
import { FeatureViewer } from "./components/FeatureViewer";
import { ConfigEditor } from "./components/ConfigEditor";

const { TabPane } = Tabs;

export const Config: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            配置管理中心
          </h1>
          <p className="text-gray-600">管理和配置不同版本的功能特性</p>
        </div>

        <Card className="shadow-sm">
          <Tabs defaultActiveKey="viewer" size="large" className="config-tabs">
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <EyeOutlined />
                  功能预览
                </span>
              }
              key="viewer"
            >
              <FeatureViewer />
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <SettingOutlined />
                  版本管理
                </span>
              }
              key="manager"
            >
              <VersionManager />
            </TabPane>

            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <FileTextOutlined />
                  配置编辑
                </span>
              }
              key="editor"
            >
              <ConfigEditor />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Config;
