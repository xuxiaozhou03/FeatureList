import {
  VersionManager,
  VersionComparator,
  getVersionConfig,
  getAllVersions,
} from "../src";

// 示例1: 基本使用
console.log("=== 基本使用示例 ===");

// 获取所有可用版本
const versions = getAllVersions();
console.log("可用版本:", versions);

// 加载基础版配置
const basicConfig = getVersionConfig("basic");
if (basicConfig) {
  const basicManager = new VersionManager(basicConfig);

  console.log("版本:", basicManager.getVersion());
  console.log("名称:", basicManager.getName());
  console.log("认证功能启用:", basicManager.isFeatureEnabled("auth"));
  console.log(
    "高级报表功能启用:",
    basicManager.isFeatureEnabled("advanced-reports")
  );

  // 获取认证功能配置
  const authConfig = basicManager.getFeatureConfig("auth");
  console.log("认证配置:", authConfig);
}

// 示例2: 版本比较
console.log("\n=== 版本比较示例 ===");

const enterpriseConfig = getVersionConfig("enterprise");
if (basicConfig && enterpriseConfig) {
  const diff = VersionComparator.compare(basicConfig, enterpriseConfig);
  const report = VersionComparator.generateReport(diff);
  console.log("版本差异报告:");
  console.log(report);
}

// 示例3: 配置导出
console.log("\n=== 配置导出示例 ===");

if (basicConfig) {
  const manager = new VersionManager(basicConfig);

  // 导出为 JSON
  console.log("JSON 格式:");
  console.log(JSON.stringify(manager.toJSON(), null, 2));

  // 导出为 YAML
  console.log("\nYAML 格式:");
  console.log(manager.toYAML());
}
