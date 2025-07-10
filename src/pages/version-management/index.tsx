import React from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const VersionManagementPage: React.FC = () => {
  return (
    <Card>
      <Title level={3}>版本管理</Title>
      <Text type="secondary">版本管理功能正在开发中...</Text>
    </Card>
  );
};

export default VersionManagementPage;
