import React from "react";
import { ConfigDemo } from "./ConfigDemo";

export const FeatureViewer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">功能预览</h3>
        <p className="text-blue-700 text-sm">
          查看和体验不同版本的功能配置，实时预览功能状态和参数设置。
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ConfigDemo />
      </div>
    </div>
  );
};
