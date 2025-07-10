import React from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const FeatureStatusPage: React.FC = () => {
  return (
    <Card>
      <Title level={3}>功能状态展示</Title>
      <Text type="secondary">功能状态展示功能正在开发中...</Text>
    </Card>
  );
};

export default FeatureStatusPage;
