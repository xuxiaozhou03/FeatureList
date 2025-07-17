export const VersionMap = {
  // 社区版
  community: "community",
  // 企业版
  enterprise: "enterprise",
  // 专业版
  premium: "premium",
} as const;

export const getVersion = (
  version: string
): "community" | "enterprise" | "premium" => {
  if (VersionMap[version as keyof typeof VersionMap]) {
    return VersionMap[version as keyof typeof VersionMap];
  }
  return VersionMap.premium;
};

export const VersionNames = Object.values(VersionMap);

export const getVersionExtesion = (version: string): string[] => {
  const realVersion = getVersion(version);
  return [".ts", ".tsx", ".js", ".jsx"].reduce((acc, ext) => {
    return [...acc, `.${realVersion}${ext}`, ext];
  }, [] as string[]);
};
