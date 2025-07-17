import React from "react";
import type { VersionItem } from "../type";
import { useVersionList } from "../hooks/useVersionList";
import mockList from "../hooks/mock";

const useFeaturesInit = () => {
  const versionFromEnv = __VERSION__ || "enterprise";
  const [currentVersion, setCurrentVersion] =
    React.useState<string>(versionFromEnv);

  const [versionItem, setVersionItem] = React.useState<VersionItem | null>(
    null
  );

  // 后续请求后端接口
  const { versions } = useVersionList();

  const version =
    versions.find((v) => v.name === currentVersion) ?? versions[0];

  const ctx = {
    currentVersion,
    setCurrentVersion,
    versionItem,
    setVersionItem,
    version,
    features: version?.features || mockList[0].features,
    versions: versions.map((v) => ({
      label: v.name,
      value: v.name,
    })),
    isEnterprise: currentVersion === "enterprise",
    isCommunity: currentVersion === "community",
    isPreimium: currentVersion === "premium",
  };

  return ctx;
};

type Ctx = ReturnType<typeof useFeaturesInit>;

const FeaturesContext = React.createContext<Ctx | null>(null);

export const FeaturesProvider = FeaturesContext.Provider;

// eslint-disable-next-line react-refresh/only-export-components
export const useFeaturesContext = () => {
  const context = React.useContext(FeaturesContext);
  if (!context) {
    throw new Error(
      "useFeaturesContext must be used within a FeaturesProvider"
    );
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFeatures = () => {
  const context = useFeaturesContext();
  return context.features;
};

export const FeaturesProviderWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const ctx = useFeaturesInit();

  return (
    <FeaturesContext.Provider value={ctx}>{children}</FeaturesContext.Provider>
  );
};
