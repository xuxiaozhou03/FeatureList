import React from "react";
import { useFeatureConfig } from "@feature-list/shared";
import type { AdvancedReportsFeatureConfig } from "@feature-list/shared";

export const AdvancedReportsPage: React.FC = () => {
  const advancedConfig =
    useFeatureConfig<AdvancedReportsFeatureConfig["config"]>(
      "advanced-reports"
    );

  return (
    <div className="advanced-reports-page">
      <h1>高级报表</h1>

      {advancedConfig?.analytics && (
        <div className="analytics-section">
          <h2>数据分析</h2>
          <div className="analytics-dashboard">
            <div className="metric-card">
              <h3>用户行为分析</h3>
              <p>页面访问量: 12,345</p>
              <p>平均停留时间: 2分30秒</p>
              <p>跳出率: 25%</p>
            </div>

            <div className="metric-card">
              <h3>转化率分析</h3>
              <p>注册转化率: 15%</p>
              <p>购买转化率: 8%</p>
              <p>复购率: 35%</p>
            </div>
          </div>
        </div>
      )}

      {advancedConfig?.charts && (
        <div className="charts-section">
          <h2>高级图表</h2>
          <div className="charts-grid">
            {advancedConfig.charts.includes("line") && (
              <div className="chart-item">
                <h3>折线图</h3>
                <div className="chart-placeholder">📈 折线图展示</div>
              </div>
            )}

            {advancedConfig.charts.includes("bar") && (
              <div className="chart-item">
                <h3>柱状图</h3>
                <div className="chart-placeholder">📊 柱状图展示</div>
              </div>
            )}

            {advancedConfig.charts.includes("pie") && (
              <div className="chart-item">
                <h3>饼图</h3>
                <div className="chart-placeholder">🥧 饼图展示</div>
              </div>
            )}

            {advancedConfig.charts.includes("scatter") && (
              <div className="chart-item">
                <h3>散点图</h3>
                <div className="chart-placeholder">⚬ 散点图展示</div>
              </div>
            )}
          </div>
        </div>
      )}

      {advancedConfig?.realtime && (
        <div className="realtime-section">
          <h2>实时数据</h2>
          <div className="realtime-dashboard">
            <div className="realtime-metric">
              <span className="metric-label">当前在线用户:</span>
              <span className="metric-value live">234</span>
            </div>

            <div className="realtime-metric">
              <span className="metric-label">实时销售额:</span>
              <span className="metric-value live">¥1,234</span>
            </div>

            <div className="realtime-chart">
              <h4>实时访问趋势</h4>
              <div className="chart-placeholder">📊 实时数据图表</div>
            </div>
          </div>
        </div>
      )}

      <div className="advanced-actions">
        <button>生成详细报告</button>
        <button>数据导出</button>
        <button>设置监控</button>
        <button>配置告警</button>
      </div>
    </div>
  );
};
