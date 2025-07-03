import React, { useState } from "react";
import { Card, Select, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export const ConfigPage: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>("enterprise");
  const navigate = useNavigate();

  const versions = [
    { value: "community", label: "社区版", color: "#52c41a" },
    { value: "enterprise", label: "企业版", color: "#1890ff" },
    { value: "professional", label: "专业版", color: "#722ed1" },
  ];

  const handleVersionChange = (value: string) => {
    setSelectedVersion(value);
  };

  const handleApplyConfig = () => {
    message.success(
      `已配置为 ${versions.find((v) => v.value === selectedVersion)?.label}`
    );
    navigate(`/display?version=${selectedVersion}`);
  };

  const handleViewDisplay = () => {
    navigate(`/display?version=${selectedVersion}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card title="版本配置" className="mb-6">
        <div className="mb-4">
          <label className="block mb-2 font-bold">选择版本:</label>
          <Select
            value={selectedVersion}
            onChange={handleVersionChange}
            className="w-52"
            size="large"
          >
            {versions.map((version) => (
              <Option key={version.value} value={version.value}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: version.color }}
                  />
                  {version.label}
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="primary" onClick={handleApplyConfig} size="large">
            应用配置
          </Button>
          <Button onClick={handleViewDisplay} size="large">
            查看功能展示
          </Button>
        </div>
      </Card>

      <Card title="版本说明">
        <div className="text-sm leading-relaxed">
          <div className="mb-4">
            <strong className="text-green-600">社区版</strong>:
            基础功能，适合个人和小团队使用
          </div>
          <div className="mb-4">
            <strong className="text-blue-600">企业版</strong>:
            包含高级功能，适合中大型企业使用
          </div>
          <div>
            <strong className="text-purple-600">专业版</strong>:
            全功能版本，适合专业团队和复杂项目
          </div>
        </div>
      </Card>
    </div>
  );
};
