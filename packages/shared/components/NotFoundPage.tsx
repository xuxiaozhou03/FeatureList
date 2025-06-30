import React from "react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>页面未找到或功能未启用</p>
      <a href="/">返回首页</a>
    </div>
  );
};
