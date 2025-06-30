import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";
import { fileURLToPath, URL } from "node:url";

interface VersionConfig {
  version: string;
  name: string;
  features: Array<{
    id: string;
    enabled: boolean;
    config?: unknown;
  }>;
}

const loadVersionConfig = (mode: string): VersionConfig => {
  const configPath = resolve(process.cwd(), `../versions/${mode}.json`);
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  // 默认配置
  return {
    version: "default",
    name: "默认版本",
    features: [],
  };
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const versionConfig = loadVersionConfig(mode);

  // 启用的功能列表
  const enabledFeatures = versionConfig.features
    .filter((f) => f.enabled)
    .map((f) => f.id);

  return {
    plugins: [react()],
    define: {
      __FEATURE_CONFIG__: JSON.stringify(versionConfig.features),
      __VERSION__: JSON.stringify(versionConfig.version),
      __ENABLED_FEATURES__: JSON.stringify(enabledFeatures),
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
        "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
        "@feature-list/shared": fileURLToPath(
          new URL("../shared", import.meta.url)
        ),
        "@config": fileURLToPath(new URL("../versions", import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 根据功能模块进行代码分割
            if (id.includes("/features/")) {
              const featureName = id.split("/features/")[1].split("/")[0];
              if (enabledFeatures.includes(featureName)) {
                return `feature-${featureName}`;
              }
              // 未启用的功能不打包
              return undefined;
            }

            // node_modules 单独打包
            if (id.includes("node_modules")) {
              return "vendor";
            }

            return "main";
          },
        },
      },
    },
  };
});
