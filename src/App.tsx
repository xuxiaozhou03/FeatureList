import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
import AppHeader from "@/components/AppHeader";
import AppSidebar from "@/components/AppSidebar";
import DefineFeaturesPage from "@/pages/define-features";
import VersionManagementPage from "@/pages/version-management";
import FeatureStatusPage from "@/pages/feature-status";
import SchemaToolsPage from "@/pages/schema-tools";
import styles from "./App.module.css";

const { Content } = Layout;

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <Layout className={styles.layout}>
          <AppHeader />
          <Layout>
            <AppSidebar />
            <Layout className={styles.contentLayout}>
              <Content className={styles.content}>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/define-features" replace />}
                  />
                  <Route
                    path="/define-features"
                    element={<DefineFeaturesPage />}
                  />
                  <Route
                    path="/version-management"
                    element={<VersionManagementPage />}
                  />
                  <Route
                    path="/feature-status"
                    element={<FeatureStatusPage />}
                  />
                  <Route path="/schema-tools" element={<SchemaToolsPage />} />
                  <Route
                    path="*"
                    element={<Navigate to="/define-features" replace />}
                  />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
