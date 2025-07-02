import versions from "./list";
import { VersionConfig } from "./types";

export * from "./types";
export { default as versions } from "./list";

export type VersionMap = typeof versions;
export type VersionKey = keyof VersionMap;
export const getVersion = (
  version: keyof typeof versions
): Promise<VersionConfig> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const config = versions[version];
      if (config) {
        resolve(config);
      } else {
        reject(new Error(`版本 ${version} 不存在`));
      }
    }, 1000);
  });
};

export * from "./useVersion";
