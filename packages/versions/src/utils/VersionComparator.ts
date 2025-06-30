import { VersionConfig, FeatureConfig, FeatureId } from "../types/feature";

/**
 * 版本差异信息
 */
export interface VersionDiff {
  added: FeatureConfig[];
  removed: FeatureId[];
  modified: {
    featureId: FeatureId;
    changes: string[];
  }[];
}

/**
 * 版本比较工具
 */
export class VersionComparator {
  /**
   * 比较两个版本的差异
   */
  static compare(
    baseVersion: VersionConfig,
    targetVersion: VersionConfig
  ): VersionDiff {
    const baseFeatures = new Map(baseVersion.features.map((f) => [f.id, f]));
    const targetFeatures = new Map(
      targetVersion.features.map((f) => [f.id, f])
    );

    const added: FeatureConfig[] = [];
    const removed: FeatureId[] = [];
    const modified: { featureId: FeatureId; changes: string[] }[] = [];

    // 检查新增的功能
    for (const [id, feature] of targetFeatures) {
      if (!baseFeatures.has(id)) {
        added.push(feature);
      }
    }

    // 检查删除和修改的功能
    for (const [id, baseFeature] of baseFeatures) {
      const targetFeature = targetFeatures.get(id);

      if (!targetFeature) {
        removed.push(id);
      } else {
        const changes = this.compareFeatures(baseFeature, targetFeature);
        if (changes.length > 0) {
          modified.push({ featureId: id, changes });
        }
      }
    }

    return { added, removed, modified };
  }

  /**
   * 比较两个功能配置的差异
   */
  private static compareFeatures(
    base: FeatureConfig,
    target: FeatureConfig
  ): string[] {
    const changes: string[] = [];

    if (base.enabled !== target.enabled) {
      changes.push(`enabled: ${base.enabled} → ${target.enabled}`);
    }

    if (base.version !== target.version) {
      changes.push(
        `version: ${base.version || "undefined"} → ${
          target.version || "undefined"
        }`
      );
    }

    // 比较配置对象
    const baseConfig = base.config || {};
    const targetConfig = target.config || {};

    const configChanges = this.compareObjects(
      baseConfig,
      targetConfig,
      "config"
    );
    changes.push(...configChanges);

    return changes;
  }

  /**
   * 递归比较对象差异
   */
  private static compareObjects(
    base: any,
    target: any,
    prefix: string
  ): string[] {
    const changes: string[] = [];
    const allKeys = new Set([...Object.keys(base), ...Object.keys(target)]);

    for (const key of allKeys) {
      const fullKey = `${prefix}.${key}`;
      const baseValue = base[key];
      const targetValue = target[key];

      if (baseValue === undefined && targetValue !== undefined) {
        changes.push(`${fullKey}: added (${JSON.stringify(targetValue)})`);
      } else if (baseValue !== undefined && targetValue === undefined) {
        changes.push(`${fullKey}: removed`);
      } else if (
        typeof baseValue === "object" &&
        typeof targetValue === "object"
      ) {
        changes.push(...this.compareObjects(baseValue, targetValue, fullKey));
      } else if (baseValue !== targetValue) {
        changes.push(
          `${fullKey}: ${JSON.stringify(baseValue)} → ${JSON.stringify(
            targetValue
          )}`
        );
      }
    }

    return changes;
  }

  /**
   * 生成差异报告
   */
  static generateReport(diff: VersionDiff): string {
    const lines: string[] = [];

    if (diff.added.length > 0) {
      lines.push("## 新增功能:");
      diff.added.forEach((feature) => {
        lines.push(`- ${feature.id}: ${feature.enabled ? "启用" : "禁用"}`);
      });
      lines.push("");
    }

    if (diff.removed.length > 0) {
      lines.push("## 删除功能:");
      diff.removed.forEach((id) => {
        lines.push(`- ${id}`);
      });
      lines.push("");
    }

    if (diff.modified.length > 0) {
      lines.push("## 修改功能:");
      diff.modified.forEach(({ featureId, changes }) => {
        lines.push(`### ${featureId}:`);
        changes.forEach((change) => {
          lines.push(`  - ${change}`);
        });
      });
    }

    return lines.join("\n");
  }
}
