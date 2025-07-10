import type {
  FeatureConfig,
  FeatureStatus,
  FeatureCondition,
  UserContext,
  FeatureEvaluation,
  SchemaValidationResult,
  FeatureTreeNode,
} from "@/types";

/**
 * 评估功能是否启用
 * @param feature 功能配置
 * @param status 功能状态
 * @param context 用户上下文
 * @returns 评估结果
 */
export function evaluateFeature(
  feature: FeatureConfig,
  status: FeatureStatus,
  context: UserContext = {}
): FeatureEvaluation {
  const evaluation: FeatureEvaluation = {
    featureId: feature.id,
    enabled: false,
    params: { ...feature.params, ...status.params },
    reason: "",
    evaluatedAt: new Date().toISOString(),
  };

  // 如果功能未启用，直接返回
  if (!status.enabled) {
    evaluation.reason = "Feature disabled in configuration";
    return evaluation;
  }

  // 检查依赖功能
  if (feature.dependencies && feature.dependencies.length > 0) {
    // 这里需要外部传入依赖检查逻辑
    evaluation.reason = "Dependencies check required";
    return evaluation;
  }

  // 检查启用条件
  if (status.conditions && status.conditions.length > 0) {
    const conditionsMet = status.conditions.every((condition) =>
      evaluateCondition(condition, context)
    );

    if (!conditionsMet) {
      evaluation.enabled = false;
      evaluation.reason = "Conditions not met";
      return evaluation;
    }
  }

  // 检查灰度发布
  if (status.rollout) {
    const rolloutResult = evaluateRollout(status.rollout, context);
    if (!rolloutResult.enabled) {
      evaluation.enabled = false;
      evaluation.reason = rolloutResult.reason;
      return evaluation;
    }
  }

  evaluation.enabled = true;
  evaluation.reason = "All conditions met";
  return evaluation;
}

/**
 * 评估单个条件
 * @param condition 条件配置
 * @param context 用户上下文
 * @returns 是否满足条件
 */
function evaluateCondition(
  condition: FeatureCondition,
  context: UserContext
): boolean {
  const { type, operator, value, field } = condition;
  let contextValue: any;

  // 获取上下文值
  switch (type) {
    case "user":
      contextValue = field ? context.custom?.[field] : context.userId;
      break;
    case "device":
      contextValue =
        field && context.device
          ? context.device[field as keyof typeof context.device]
          : context.device?.type;
      break;
    case "location":
      contextValue =
        field && context.location
          ? context.location[field as keyof typeof context.location]
          : context.location?.country;
      break;
    case "time":
      contextValue = new Date().toISOString();
      break;
    case "percentage":
      // 基于用户ID生成稳定的随机数
      contextValue = generateStableRandom(context.userId || "anonymous") * 100;
      break;
    case "custom":
      contextValue = field ? context.custom?.[field] : context.custom;
      break;
    default:
      return false;
  }

  // 根据操作符比较值
  switch (operator) {
    case "equals":
      return contextValue === value;
    case "in":
      return Array.isArray(value) && value.includes(contextValue);
    case "contains":
      return typeof contextValue === "string" && contextValue.includes(value);
    case "greater":
      return Number(contextValue) > Number(value);
    case "less":
      return Number(contextValue) < Number(value);
    case "between":
      return (
        Array.isArray(value) &&
        value.length === 2 &&
        Number(contextValue) >= Number(value[0]) &&
        Number(contextValue) <= Number(value[1])
      );
    default:
      return false;
  }
}

/**
 * 评估灰度发布
 * @param rollout 灰度配置
 * @param context 用户上下文
 * @returns 灰度结果
 */
function evaluateRollout(
  rollout: any,
  context: UserContext
): { enabled: boolean; reason: string } {
  const { strategy, percentage, whitelist } = rollout;

  switch (strategy) {
    case "percentage":
      if (typeof percentage === "number") {
        const userHash =
          generateStableRandom(context.userId || "anonymous") * 100;
        return {
          enabled: userHash < percentage,
          reason: `Percentage rollout: ${userHash.toFixed(
            2
          )}% < ${percentage}%`,
        };
      }
      return { enabled: false, reason: "Invalid percentage configuration" };

    case "whitelist":
      if (Array.isArray(whitelist) && context.userId) {
        return {
          enabled: whitelist.includes(context.userId),
          reason: `Whitelist check for user: ${context.userId}`,
        };
      }
      return { enabled: false, reason: "User not in whitelist or no user ID" };

    case "gradual":
      // 渐进式发布需要结合时间计算当前百分比
      // 这里简化实现，实际需要根据发布时间计算
      return { enabled: true, reason: "Gradual rollout (simplified)" };

    default:
      return { enabled: false, reason: "Unknown rollout strategy" };
  }
}

/**
 * 基于字符串生成稳定的随机数（0-1）
 * @param input 输入字符串
 * @returns 0-1之间的数字
 */
function generateStableRandom(input: string): number {
  let hash = 0;
  if (input.length === 0) return hash;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // 转换为 0-1 之间的数字
  return Math.abs(hash) / 2147483647;
}

/**
 * 验证 JSON Schema
 * @param data 要验证的数据
 * @param schema JSON Schema
 * @returns 验证结果
 */
export function validateJsonSchema(
  data: any,
  schema: any
): SchemaValidationResult {
  try {
    // 这里应该使用 ajv 或其他 JSON Schema 验证库
    // 简化实现，仅做基本验证
    const errors: Array<{ path: string; message: string; value?: any }> = [];

    // 基本类型验证
    if (schema.type && typeof data !== schema.type) {
      errors.push({
        path: "",
        message: `Expected type ${schema.type}, got ${typeof data}`,
        value: data,
      });
    }

    // 必需字段验证
    if (schema.required && Array.isArray(schema.required)) {
      schema.required.forEach((field: string) => {
        if (!data || !(field in data)) {
          errors.push({
            path: field,
            message: `Missing required field: ${field}`,
            value: undefined,
          });
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          path: "",
          message: `Schema validation error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          value: data,
        },
      ],
    };
  }
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: any
): T {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        (result as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        (result as any)[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * 检查是否为对象
 * @param item 要检查的值
 * @returns 是否为对象
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * 生成唯一ID
 * @param prefix 前缀
 * @returns 唯一ID
 */
export function generateId(prefix = "id"): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string,
  format = "YYYY-MM-DD HH:mm:ss"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

/**
 * 下载文件
 * @param content 文件内容
 * @param filename 文件名
 * @param mimeType MIME类型
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType = "application/json"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * 复制到剪贴板
 * @param text 要复制的文本
 * @returns Promise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

// 嵌套功能管理工具函数
export const nestedFeatureUtils = {
  /**
   * 将扁平化的功能列表转换为树形结构
   */
  buildFeatureTree: (features: FeatureConfig[]): FeatureTreeNode[] => {
    const featureMap = new Map<string, FeatureTreeNode>();
    const roots: FeatureTreeNode[] = [];

    // 创建节点映射
    features.forEach((feature) => {
      const node: FeatureTreeNode = {
        ...feature,
        children: [],
        expanded: feature.expanded ?? false,
        indent: feature.level ?? 0,
        isLeaf: !feature.children || feature.children.length === 0,
        path: [],
      };
      featureMap.set(feature.id, node);
    });

    // 构建树形结构
    features.forEach((feature) => {
      const node = featureMap.get(feature.id)!;

      if (feature.parentId) {
        const parent = featureMap.get(feature.parentId);
        if (parent) {
          parent.children.push(node);
          parent.isLeaf = false;
          node.path = [...parent.path, parent.id];
        }
      } else {
        roots.push(node);
        node.path = [];
      }
    });

    return roots.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  /**
   * 将树形结构转换为扁平化列表
   */
  flattenFeatureTree: (tree: FeatureTreeNode[]): FeatureConfig[] => {
    const result: FeatureConfig[] = [];

    const traverse = (nodes: FeatureTreeNode[], level = 0) => {
      nodes.forEach((node) => {
        const { children, expanded, indent, isLeaf, path, ...feature } = node;
        result.push({
          ...feature,
          level,
          children:
            children.length > 0
              ? children.map((child) => {
                  const {
                    children: grandChildren,
                    expanded,
                    indent,
                    isLeaf,
                    path,
                    ...childFeature
                  } = child;
                  return childFeature;
                })
              : undefined,
        });

        if (children.length > 0) {
          traverse(children, level + 1);
        }
      });
    };

    traverse(tree);
    return result;
  },

  /**
   * 获取功能的所有子功能
   */
  getChildFeatures: (
    featureId: string,
    features: FeatureConfig[]
  ): FeatureConfig[] => {
    const children: FeatureConfig[] = [];

    const findChildren = (parentId: string) => {
      features.forEach((feature) => {
        if (feature.parentId === parentId) {
          children.push(feature);
          findChildren(feature.id);
        }
      });
    };

    findChildren(featureId);
    return children;
  },

  /**
   * 获取功能的所有父功能路径
   */
  getFeaturePath: (
    featureId: string,
    features: FeatureConfig[]
  ): FeatureConfig[] => {
    const path: FeatureConfig[] = [];
    const feature = features.find((f) => f.id === featureId);

    if (feature) {
      path.unshift(feature);
      if (feature.parentId) {
        path.unshift(
          ...nestedFeatureUtils.getFeaturePath(feature.parentId, features)
        );
      }
    }

    return path;
  },

  /**
   * 验证功能层级结构
   */
  validateFeatureHierarchy: (
    features: FeatureConfig[],
    maxDepth = 5
  ): {
    valid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    const featureMap = new Map(features.map((f) => [f.id, f]));

    features.forEach((feature) => {
      // 检查父功能是否存在
      if (feature.parentId && !featureMap.has(feature.parentId)) {
        errors.push(`功能 ${feature.name} 的父功能 ${feature.parentId} 不存在`);
      }

      // 检查循环依赖
      if (feature.parentId) {
        const visited = new Set<string>();
        let current = feature.parentId;

        while (current && !visited.has(current)) {
          visited.add(current);
          const parent = featureMap.get(current);
          if (parent?.parentId === feature.id) {
            errors.push(`功能 ${feature.name} 存在循环依赖`);
            break;
          }
          current = parent?.parentId || undefined;
        }
      }

      // 检查层级深度
      if ((feature.level ?? 0) > maxDepth) {
        errors.push(`功能 ${feature.name} 层级过深，超过最大深度 ${maxDepth}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * 生成功能的显示标题（包含层级缩进）
   */
  getFeatureDisplayTitle: (
    feature: FeatureConfig,
    indentChar = "  "
  ): string => {
    const indent = indentChar.repeat(feature.level ?? 0);
    const icon = feature.icon ? `${feature.icon} ` : "";
    return `${indent}${icon}${feature.name}`;
  },

  /**
   * 移动功能到新的父节点
   */
  moveFeature: (
    features: FeatureConfig[],
    featureId: string,
    newParentId?: string,
    _newIndex?: number
  ): FeatureConfig[] => {
    const result = [...features];
    const featureIndex = result.findIndex((f) => f.id === featureId);

    if (featureIndex === -1) return result;

    const feature = { ...result[featureIndex] };

    // 更新功能的父节点
    feature.parentId = newParentId;

    // 重新计算层级
    if (newParentId) {
      const newParent = result.find((f) => f.id === newParentId);
      feature.level = (newParent?.level ?? 0) + 1;
    } else {
      feature.level = 0;
    }

    // 更新所有子功能的层级
    const updateChildrenLevel = (parentId: string, baseLevel: number) => {
      result.forEach((f, index) => {
        if (f.parentId === parentId) {
          result[index] = { ...f, level: baseLevel + 1 };
          updateChildrenLevel(f.id, baseLevel + 1);
        }
      });
    };

    updateChildrenLevel(feature.id, feature.level);
    result[featureIndex] = feature;

    return result;
  },
};
