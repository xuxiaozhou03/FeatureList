import React from "react";
import { useFeatureConfig } from "@feature-list/shared";
import type { ApiManagementFeatureConfig } from "@feature-list/shared";

export const ApiManagementPage: React.FC = () => {
  const apiConfig =
    useFeatureConfig<ApiManagementFeatureConfig["config"]>("api-management");

  return (
    <div className="api-management-page">
      <h1>API管理</h1>

      <div className="api-overview">
        <div className="api-stats">
          <div className="stat-item">
            <span className="stat-value">25</span>
            <span className="stat-label">API接口数</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">1,234</span>
            <span className="stat-label">今日调用次数</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">可用性</span>
          </div>
        </div>
      </div>

      <div className="api-list">
        <h2>API接口列表</h2>
        <table className="api-table">
          <thead>
            <tr>
              <th>API名称</th>
              <th>路径</th>
              <th>方法</th>
              <th>状态</th>
              <th>调用次数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>用户登录</td>
              <td>/api/auth/login</td>
              <td>POST</td>
              <td>✅ 正常</td>
              <td>125</td>
              <td>
                <button>查看</button>
                <button>编辑</button>
              </td>
            </tr>
            <tr>
              <td>获取用户信息</td>
              <td>/api/user/profile</td>
              <td>GET</td>
              <td>✅ 正常</td>
              <td>89</td>
              <td>
                <button>查看</button>
                <button>编辑</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {apiConfig?.rateLimit && (
        <div className="rate-limit-section">
          <h2>限流设置</h2>
          <div className="rate-limit-config">
            <div className="config-item">
              <label>每分钟请求数限制:</label>
              <input type="number" defaultValue="100" />
            </div>
            <div className="config-item">
              <label>每小时请求数限制:</label>
              <input type="number" defaultValue="5000" />
            </div>
            <button>应用设置</button>
          </div>
        </div>
      )}

      {apiConfig?.monitoring && (
        <div className="monitoring-section">
          <h2>API监控</h2>
          <div className="monitoring-dashboard">
            <div className="monitor-chart">
              <h3>响应时间趋势</h3>
              <div className="chart-placeholder">📈 响应时间图表</div>
            </div>

            <div className="monitor-chart">
              <h3>错误率统计</h3>
              <div className="chart-placeholder">📊 错误率图表</div>
            </div>

            <div className="alert-list">
              <h3>告警信息</h3>
              <div className="alert-item">
                <span className="alert-time">2025-06-30 14:30</span>
                <span className="alert-message">API响应时间超过阈值</span>
                <span className="alert-level warning">警告</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {apiConfig?.documentation && (
        <div className="documentation-section">
          <h2>API文档</h2>
          <div className="doc-actions">
            <button>生成文档</button>
            <button>在线查看</button>
            <button>导出文档</button>
          </div>

          <div className="doc-preview">
            <h3>文档预览</h3>
            <div className="doc-content">
              <h4>用户登录 API</h4>
              <p>
                <strong>路径:</strong> /api/auth/login
              </p>
              <p>
                <strong>方法:</strong> POST
              </p>
              <p>
                <strong>参数:</strong>
              </p>
              <ul>
                <li>username (string): 用户名</li>
                <li>password (string): 密码</li>
              </ul>
              <p>
                <strong>返回:</strong>
              </p>
              <pre>{`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
