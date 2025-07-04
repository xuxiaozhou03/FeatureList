import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const getVersionAndExtensions = (defaultVersion: string) => {
  let version = process.env.VERSION;
  let currentVersion = version;

  if (!version) {
    // 如果没有设置版本，使用默认版本
    version = defaultVersion;
    currentVersion = defaultVersion;
  } else {
    // 如果设置了版本，确保它是有效的
    const validVersions = ["community", "enterprise"];
    if (!validVersions.includes(currentVersion)) {
      currentVersion = "professional";
    }
  }
  const extensions = [".js", ".jsx", ".ts", ".tsx"].reduce(
    (acc, ext) => [...acc, `.${currentVersion}${ext}`, ext],
    []
  );
  return { version, extensions };
};

// https://vitejs.dev/config/
export default defineConfig(() => {
  // 读取环境变量
  const { version, extensions } = getVersionAndExtensions("enterprise");

  return {
    plugins: [react()],
    resolve: {
      alias: {},
      extensions,
    },
    server: {
      port: 3001,
      open: true,
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    define: {
      // 将环境变量暴露给客户端代码
      __VERSION__: JSON.stringify(version),
    },
  };
});
