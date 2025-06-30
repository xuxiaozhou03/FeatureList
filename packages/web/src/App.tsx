import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import {
  FeatureProvider,
  FeatureGate,
  NotFoundPage,
  useFeature,
  ConfigService,
} from "@feature-list/shared";
import type { VersionConfig, FeatureConfig } from "@feature-list/shared";

// 导入功能组件
import {
  LoginPage,
  RegisterPage,
  UserProfile,
} from "./features/auth/components";
import { DashboardPage } from "./features/dashboard/components";
import { ReportsPage } from "./features/reports/components";
import { AdvancedReportsPage } from "./features/advanced-reports/components";
import { ApiManagementPage } from "./features/api-management/components";

import "./App.css";

// 创建一个功能路由包装组件
const FeatureRoute: React.FC<{
  feature: string;
  path: string;
  element: React.ReactElement;
}> = ({ feature, path, element }) => {
  const isEnabled = useFeature(feature);

  if (!isEnabled) {
    return <Route path={path} element={<Navigate to="/404" replace />} />;
  }

  return <Route path={path} element={element} />;
};

// 应用路由组件
const AppRoutes: React.FC<{ config: VersionConfig }> = ({ config }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage config={config} />} />

      {/* <FeatureRoute feature="auth" path="/login" element={<LoginPage />} />
      <FeatureRoute
        feature="auth"
        path="/register"
        element={<RegisterPage />}
      />
      <FeatureRoute feature="auth" path="/profile" element={<UserProfile />} />

      <FeatureRoute
        feature="dashboard"
        path="/dashboard"
        element={<DashboardPage />}
      />

      <FeatureRoute
        feature="reports"
        path="/reports"
        element={<ReportsPage />}
      />

      <FeatureRoute
        feature="advanced-reports"
        path="/advanced-reports"
        element={<AdvancedReportsPage />}
      />

      <FeatureRoute
        feature="api-management"
        path="/api-management"
        element={<ApiManagementPage />}
      /> */}

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

function App() {
  const configService = ConfigService.getInstance();
  const config = configService.getConfig();

  return (
    <FeatureProvider config={config}>
      <BrowserRouter>
        <div className="app">
          <header className="app-header">
            <nav className="app-nav">
              <div className="nav-brand">
                <Link to="/">FeatureList Demo</Link>
                <span className="version-badge">
                  {config.name} ({config.version})
                </span>
              </div>

              <ul className="nav-links">
                <FeatureGate feature="dashboard">
                  <li>
                    <Link to="/dashboard">仪表盘</Link>
                  </li>
                </FeatureGate>

                <FeatureGate feature="reports">
                  <li>
                    <Link to="/reports">基础报表</Link>
                  </li>
                </FeatureGate>

                <FeatureGate feature="advanced-reports">
                  <li>
                    <Link to="/advanced-reports">高级报表</Link>
                  </li>
                </FeatureGate>

                <FeatureGate feature="api-management">
                  <li>
                    <Link to="/api-management">API管理</Link>
                  </li>
                </FeatureGate>

                <FeatureGate feature="auth">
                  <li>
                    <Link to="/profile">用户中心</Link>
                  </li>
                </FeatureGate>
              </ul>

              <div className="nav-auth">
                <FeatureGate feature="auth">
                  <Link to="/login" className="login-btn">
                    登录
                  </Link>
                </FeatureGate>
              </div>
            </nav>
          </header>

          <main className="app-main">
            <AppRoutes config={config} />
          </main>
        </div>
      </BrowserRouter>
    </FeatureProvider>
  );
}

// 首页组件
const HomePage: React.FC<{ config: VersionConfig }> = ({ config }) => {
  return (
    <div className="home-page">
      <h1>欢迎使用 FeatureList 多版本部署演示</h1>
      <p>
        当前版本: <strong>{config.name}</strong> ({config.version})
      </p>

      <div className="features-overview">
        <h2>已启用的功能模块</h2>
        <div className="features-grid">
          {config.features.map(
            (feature: FeatureConfig) =>
              feature.enabled && (
                <div key={feature.id} className="feature-card">
                  <h3>{getFeatureName(feature.id)}</h3>
                  <p>功能ID: {feature.id}</p>
                  <Link
                    to={getFeatureRoute(feature.id)}
                    className="feature-link"
                  >
                    进入模块
                  </Link>
                </div>
              )
          )}
        </div>
      </div>

      <div className="version-info">
        <h2>版本对比</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>功能模块</th>
                <th>基础版</th>
                <th>企业版</th>
                <th>当前版本</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>用户认证</td>
                <td>✅</td>
                <td>✅ (增强)</td>
                <td>{hasFeature(config, "auth") ? "✅" : "❌"}</td>
              </tr>
              <tr>
                <td>仪表盘</td>
                <td>✅</td>
                <td>✅ (增强)</td>
                <td>{hasFeature(config, "dashboard") ? "✅" : "❌"}</td>
              </tr>
              <tr>
                <td>基础报表</td>
                <td>✅</td>
                <td>✅</td>
                <td>{hasFeature(config, "reports") ? "✅" : "❌"}</td>
              </tr>
              <tr>
                <td>高级报表</td>
                <td>❌</td>
                <td>✅</td>
                <td>{hasFeature(config, "advanced-reports") ? "✅" : "❌"}</td>
              </tr>
              <tr>
                <td>API管理</td>
                <td>❌</td>
                <td>✅</td>
                <td>{hasFeature(config, "api-management") ? "✅" : "❌"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 辅助函数
function getFeatureName(featureId: string): string {
  const names: Record<string, string> = {
    auth: "用户认证",
    dashboard: "仪表盘",
    reports: "基础报表",
    "advanced-reports": "高级报表",
    "api-management": "API管理",
  };
  return names[featureId] || featureId;
}

function getFeatureRoute(featureId: string): string {
  const routes: Record<string, string> = {
    auth: "/login",
    dashboard: "/dashboard",
    reports: "/reports",
    "advanced-reports": "/advanced-reports",
    "api-management": "/api-management",
  };
  return routes[featureId] || "/";
}

function hasFeature(config: VersionConfig, featureId: string): boolean {
  return config.features.some(
    (f: FeatureConfig) => f.id === featureId && f.enabled
  );
}

export default App;
