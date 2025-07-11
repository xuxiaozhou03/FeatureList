import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
import AppHeader from "@/components/AppHeader";
import DefineFeaturesPage from "@/pages";
import styles from "./App.module.css";

const { Content } = Layout;

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <Layout className={styles.layout}>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <AppHeader />
          </div>
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
                  path="*"
                  element={<Navigate to="/define-features" replace />}
                />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
