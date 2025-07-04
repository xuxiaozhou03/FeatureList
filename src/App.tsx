import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import DefinePage from "./modules/define";
import VersionPage from "./modules/version";

function App() {
  console.log("Current version:", __VERSION__);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/define" replace />} />
          <Route path="/define" element={<DefinePage />} />
          <Route path="/version" element={<VersionPage />} />
          <Route path="/display" element={<div />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
