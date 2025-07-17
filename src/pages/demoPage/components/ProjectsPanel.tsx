import React from "react";
import { Button, Descriptions, Divider, message, Tag } from "antd";
import { useFeatures } from "../../../core";

const ProjectsPanel: React.FC = () => {
  const features = useFeatures();

  const handleAdd = () => {
    message.success("可以创建");
  };

  return (
    <>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="启用状态">
          <Tag color={features.projects.enabled ? "green" : "red"}>
            {features.projects.enabled ? "已启用" : "未启用"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="可创建项目">
          {features.projects.config.canCreate ? "是" : "否"}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <div className="mb-2 flex justify-between items-center">
        <span className="font-medium">项目</span>
        <Button
          type="primary"
          disabled={!features.projects.config.canCreate}
          onClick={handleAdd}
          size="small"
        >
          创建项目
        </Button>
      </div>
    </>
  );
};

export default ProjectsPanel;
