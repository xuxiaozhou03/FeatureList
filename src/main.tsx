import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// 设置 Ant Design 中文语言包
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
