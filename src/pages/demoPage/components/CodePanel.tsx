import React from "react";
import { Descriptions, Divider, Tag } from "antd";
import { useFeatures } from "../../../core";

const CodePanel: React.FC = () => {
  const features = useFeatures();

  return (
    <>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="启用状态">
          <Tag color={features.code.enabled ? "green" : "red"}>
            {features.code.enabled ? "已启用" : "未启用"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="代码仓库">
          {features.code.repos.enabled ? "启用" : "禁用"}
        </Descriptions.Item>
        <Descriptions.Item label="LFS 支持">
          {features.code.lfs.enabled ? "启用" : "禁用"}
        </Descriptions.Item>
        <Descriptions.Item label="LFS 最大文件大小">
          {features.code.lfs.config.maxFileSize} MB
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      {features.code.repos.enabled && (
        <div className="mb-2 flex justify-between items-center">
          <span className="font-medium">支持代码仓库</span>
        </div>
      )}

      {features.code.lfs.enabled && (
        <div className="mb-2 flex justify-between items-center">
          <span className="font-medium">LFS 支持</span>
          <span>{features.code.lfs.config.maxFileSize} MB</span>
        </div>
      )}
    </>
  );
};

export default CodePanel;
