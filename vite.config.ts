import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const Versions = ["community", "enterprise", "premium"] as const;
type Version = (typeof Versions)[number];

const getVersion = (version: string): Version => {
  if (Versions.includes(version as unknown as Version)) {
    return version as Version;
  }
  return "premium";
};

const getVersionExtesion = (version: string): string[] => {
  const realVersion = getVersion(version);
  return [".ts", ".tsx", ".js", ".jsx"].reduce((acc, ext) => {
    return [...acc, `.${realVersion}${ext}`, ext];
  }, [] as string[]);
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/FeatureList/" : "/",
  resolve: {
    extensions: getVersionExtesion(process.env.VERSION || "enterprise"),
  },
  define: {
    __VERSION__: JSON.stringify(process.env.VERSION || "enterprise"),
  },
});
