import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import DefinePage from "./modules/define";
import VersionPage from "./modules/version";
import VersionsPage from "./modules/versions";
import DisplayPage from "./modules/display";
import DisplayControlPage from "./modules/display-control";

function App() {
  console.log("Current version:", __VERSION__);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/define" replace />} />
          <Route path="/define" element={<DefinePage />} />
          <Route path="/version" element={<VersionPage />} />
          <Route path="/versions" element={<VersionsPage />} />
          <Route path="/display" element={<DisplayPage />} />
          <Route path="/display-control" element={<DisplayControlPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
