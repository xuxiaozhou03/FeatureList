import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  FeatureListPage,
  FeaturesProviderWrapper,
  useFeaturesContext,
} from "./core";
import IndexPage from "./pages/indexPage";
import DemoPage from "./pages/demoPage";
import React from "react";

function AppNav() {
  const location = useLocation();
  const { envVersion } = useFeaturesContext();
  const list = [
    {
      to: "/",
      label: "首页",
    },
    {
      to: "/features",
      label: "功能清单",
    },
    {
      to: "/demo",
      label: "演示页面",
    },
  ];
  return (
    <nav className="px-8 py-4 bg-white shadow flex items-center gap-6 text-lg font-medium relative z-10">
      {list.map((item, idx) => (
        <React.Fragment key={item.to}>
          {idx > 0 && <span className="text-gray-300">|</span>}
          <Link
            to={item.to}
            className={
              `no-underline px-3 py-1 rounded transition-colors hover:bg-blue-50 ` +
              (location.pathname === item.to ||
              (item.to !== "/" && location.pathname.startsWith(item.to))
                ? "text-white bg-blue-600"
                : "text-blue-600")
            }
          >
            {item.label}
          </Link>
        </React.Fragment>
      ))}
      <div className="flex-1 flex justify-end">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-100 text-gray-600 text-sm font-mono border border-gray-200 shadow-sm">
          <span className="text-gray-400">构建版本：</span>
          <span className="font-bold text-blue-600">{envVersion}</span>
        </span>
      </div>
    </nav>
  );
}

function App() {
  return (
    <FeaturesProviderWrapper>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex h-screen flex-col overflow-hidden">
                <IndexPage />
              </div>
            }
          />
          <Route
            path="/features"
            element={
              <div className="flex h-screen flex-col overflow-hidden">
                <AppNav />
                <FeatureListPage />
              </div>
            }
          />
          <Route
            path="/demo"
            element={
              <div className="flex h-screen flex-col overflow-hidden">
                <AppNav />
                <DemoPage />
              </div>
            }
          />
        </Routes>
      </Router>
    </FeaturesProviderWrapper>
  );
}

export default App;
