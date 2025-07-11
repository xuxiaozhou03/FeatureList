import React from "react";
import styles from "./style.module.css";
import { Typography } from "antd";
const { Title, Text } = Typography;

const Wrapper: React.FC<
  React.PropsWithChildren<{
    title?: string;
    description?: string;
  }>
> = (props) => {
  return (
    <div>
      <div className={styles.header}>
        <div>
          <Title level={3}>{props.title}</Title>
          <Text type="secondary">{props.description}</Text>
        </div>
      </div>
      {props.children}
    </div>
  );
};

export default Wrapper;
