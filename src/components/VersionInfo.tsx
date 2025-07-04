import React from "react";
import { Tag } from "antd";

export const VersionInfo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/80 text-sm">构建版本:</span>
      <Tag
        color="cyan"
        className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-800 border-0"
      >
        {__VERSION__}
      </Tag>
    </div>
  );
};
