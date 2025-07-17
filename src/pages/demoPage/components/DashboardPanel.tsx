import React, { useState } from "react";
import {
  Descriptions,
  Tag,
  Card,
  Button,
  message,
  Row,
  Col,
  Divider,
} from "antd";
import { useFeatures } from "../../../core";

const DashboardPanel: React.FC = () => {
  const features = useFeatures();
  // 假设已有2个卡片
  const [cards, setCard] = useState([
    { id: 1, title: "卡片1", content: "内容1" },
    { id: 2, title: "卡片2", content: "内容2" },
  ]);

  const handleAdd = () => {
    if (cards.length < features.dashboard.config.maxItems) {
      // 这里可以添加逻辑来新增卡片
      message.success("新增卡片成功");
      const newCard = {
        id: cards.length + 1,
        title: `卡片 ${cards.length + 1}`,
        content: `内容 ${cards.length + 1}`,
      };
      setCard([...cards, newCard]);
      return;
    }
    message.warning("已达最大数量，无法新增");
  };

  return (
    <>
      <Descriptions column={1} size="small" bordered className="mb-4">
        <Descriptions.Item label="启用状态">
          <Tag color={features.dashboard.enabled ? "green" : "red"}>
            {features.dashboard.enabled ? "已启用" : "未启用"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="最大显示卡片数">
          {features.dashboard.config.maxItems}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <div className="mb-2 flex justify-between items-center">
        <span className="font-medium">卡片列表</span>
        <Button
          type="primary"
          disabled={features.dashboard.config.maxItems <= cards.length}
          onClick={handleAdd}
          size="small"
        >
          新增卡片
        </Button>
      </div>
      <Row gutter={12}>
        {cards.map((card) => (
          <Col span={12} key={card.id}>
            <Card title={card.title} size="small">
              {card.content}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default DashboardPanel;
