import React from "react";
import { useFeatureConfig } from "@feature-list/shared";
import type { DashboardFeatureConfig } from "@feature-list/shared";

export const DashboardPage: React.FC = () => {
  const dashboardConfig =
    useFeatureConfig<DashboardFeatureConfig["config"]>("dashboard");

  return (
    <div className="dashboard-page">
      <h1>仪表盘</h1>

      <div className="dashboard-widgets">
        {dashboardConfig?.widgets?.includes("chart") && (
          <div className="widget chart-widget">
            <h3>图表组件</h3>
            <div className="chart-placeholder">📊 图表数据展示</div>
          </div>
        )}

        {dashboardConfig?.widgets?.includes("table") && (
          <div className="widget table-widget">
            <h3>表格组件</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>名称</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>项目A</td>
                  <td>进行中</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>项目B</td>
                  <td>已完成</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {dashboardConfig?.widgets?.includes("kpi") && (
          <div className="widget kpi-widget">
            <h3>KPI指标</h3>
            <div className="kpi-items">
              <div className="kpi-item">
                <span className="kpi-value">125</span>
                <span className="kpi-label">总用户数</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-value">89%</span>
                <span className="kpi-label">完成率</span>
              </div>
            </div>
          </div>
        )}

        {dashboardConfig?.widgets?.includes("calendar") && (
          <div className="widget calendar-widget">
            <h3>日历</h3>
            <div className="calendar-placeholder">📅 日历组件</div>
          </div>
        )}
      </div>

      {dashboardConfig?.customizable && (
        <div className="dashboard-controls">
          <h3>自定义设置</h3>
          <button>添加组件</button>
          <button>布局设置</button>
          <button>保存配置</button>
        </div>
      )}
    </div>
  );
};
