import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { ConfigPage } from "./pages/ConfigPage";
import { DisplayPage } from "./pages/DisplayPage";

function App() {
  console.log("Current version:", __VERSION__);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/config" replace />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/display" element={<DisplayPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
