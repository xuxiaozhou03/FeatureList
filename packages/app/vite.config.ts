import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

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
      alias: {
        "@core": resolve(__dirname, "../core/src"),
      },
    },
    define: {
      "process.env.VERSION": JSON.stringify(version),
      "process.env.VERSION_TYPE": JSON.stringify(versionType),
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
