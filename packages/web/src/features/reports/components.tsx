import React from "react";
import { useFeatureConfig } from "@feature-list/shared";
import type { ReportsFeatureConfig } from "@feature-list/shared";

export const ReportsPage: React.FC = () => {
  const reportsConfig =
    useFeatureConfig<ReportsFeatureConfig["config"]>("reports");

  return (
    <div className="reports-page">
      <h1>基础报表</h1>

      <div className="report-content">
        <div className="report-section">
          <h3>用户统计报表</h3>
          <table className="report-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>新增用户</th>
                <th>活跃用户</th>
                <th>总用户数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-06-30</td>
                <td>12</td>
                <td>89</td>
                <td>125</td>
              </tr>
              <tr>
                <td>2025-06-29</td>
                <td>8</td>
                <td>92</td>
                <td>113</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report-section">
          <h3>销售数据报表</h3>
          <div className="report-summary">
            <div className="summary-item">
              <span className="label">今日销售额:</span>
              <span className="value">¥12,345</span>
            </div>
            <div className="summary-item">
              <span className="label">本月销售额:</span>
              <span className="value">¥456,789</span>
            </div>
          </div>
        </div>
      </div>

      <div className="report-actions">
        {reportsConfig?.export && (
          <div className="export-section">
            <h3>导出报表</h3>
            <button>导出PDF</button>
            <button>导出Excel</button>
            <button>导出CSV</button>
          </div>
        )}

        {reportsConfig?.schedule && (
          <div className="schedule-section">
            <h3>定时报表</h3>
            <button>设置定时发送</button>
            <button>管理定时任务</button>
          </div>
        )}

        {reportsConfig?.customFields && (
          <div className="custom-fields-section">
            <h3>自定义字段</h3>
            <button>添加字段</button>
            <button>字段管理</button>
          </div>
        )}
      </div>
    </div>
  );
};
