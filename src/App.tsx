import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FeatureListPage from "./pages/FeatureListPage";

function Home() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

function App() {
  return (
    <Router>
      <nav className="px-8 py-4 bg-white shadow flex items-center gap-6 text-lg font-medium">
        <Link
          to="/"
          className="text-blue-600 no-underline px-3 py-1 rounded transition-colors hover:bg-blue-50"
        >
          首页
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          to="/features"
          className="text-blue-600 no-underline px-3 py-1 rounded transition-colors hover:bg-blue-50"
        >
          功能清单
        </Link>
      </nav>
      <Routes>
        <Route path="/features" element={<FeatureListPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
