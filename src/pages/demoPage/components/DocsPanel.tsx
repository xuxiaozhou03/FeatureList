import React from "react";
import { Descriptions, Tag } from "antd";
import { useFeatures } from "../../../core";

import EditorDemo from "./EditorDemo";

const DocsPanel: React.FC = () => {
  const features = useFeatures();

  return (
    <>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="启用状态">
          <Tag color={features.docs.enabled ? "green" : "red"}>
            {features.docs.enabled ? "已启用" : "未启用"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="文档模式">
          {features.docs.config.mode === "markdown" ? "Markdown" : "富文本"}
        </Descriptions.Item>
        <Descriptions.Item label="编辑器示例">
          <EditorDemo
            mode={
              features.docs.config.mode === "markdown" ? "markdown" : "richtext"
            }
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default DocsPanel;
