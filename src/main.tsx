import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FeaturesProviderWrapper } from "./core/index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FeaturesProviderWrapper>
      <App />
    </FeaturesProviderWrapper>
  </StrictMode>
);
