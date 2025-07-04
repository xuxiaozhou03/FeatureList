import React from "react";
import { Tag } from "antd";

export const VersionInfo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white">构建版本:</span>
      <Tag color="cyan">{__VERSION__}</Tag>
    </div>
  );
};
