import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function getVersionType(
  version?: string
): "community" | "enterprise" | "professional" {
  const currentVersion = version || "community";

  if (currentVersion === "community") return "community";
  if (currentVersion === "enterprise") return "enterprise";

  return "professional";
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const version = process.env.VERSION || "community";
  const versionType = getVersionType(version);

  return {
    plugins: [react()],
    resolve: {
      alias: {},
    },
    define: {
      "process.env.VERSION": JSON.stringify(version),
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: `dist/${versionType}`,
      sourcemap: true,
    },
  };
});
