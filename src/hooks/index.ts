import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  FeatureConfig,
  FeatureList,
  VersionConfig,
  FeatureStatus,
  UserContext,
  FeatureEvaluation,
  PaginatedResponse,
  FilterParams,
  SortParams,
} from "@/types";
import { evaluateFeature, generateId } from "@/utils";

// 模拟的 localStorage 键
const STORAGE_KEYS = {
  FEATURE_LISTS: "featureList:lists",
  VERSION_CONFIGS: "featureList:versions",
  USER_CONTEXT: "featureList:userContext",
  CURRENT_VERSION: "featureList:currentVersion",
} as const;

/**
 * 功能清单管理 Hook
 */
export function useFeatureLists() {
  const [featureLists, setFeatureLists] = useState<FeatureList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载功能清单
  const loadFeatureLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 从 localStorage 加载
      const stored = localStorage.getItem(STORAGE_KEYS.FEATURE_LISTS);
      const lists = stored ? JSON.parse(stored) : [];

      setFeatureLists(lists);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load feature lists"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存功能清单
  const saveFeatureList = useCallback(
    async (featureList: Omit<FeatureList, "createdAt" | "updatedAt">) => {
      try {
        const now = new Date().toISOString();
        const newList: FeatureList = {
          ...featureList,
          createdAt: now,
          updatedAt: now,
        };

        const updatedLists = [
          ...featureLists.filter((l) => l.version !== newList.version),
          newList,
        ];
        setFeatureLists(updatedLists);
        localStorage.setItem(
          STORAGE_KEYS.FEATURE_LISTS,
          JSON.stringify(updatedLists)
        );

        return newList;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save feature list"
        );
        throw err;
      }
    },
    [featureLists]
  );

  // 删除功能清单
  const deleteFeatureList = useCallback(
    async (version: string) => {
      try {
        const updatedLists = featureLists.filter((l) => l.version !== version);
        setFeatureLists(updatedLists);
        localStorage.setItem(
          STORAGE_KEYS.FEATURE_LISTS,
          JSON.stringify(updatedLists)
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete feature list"
        );
        throw err;
      }
    },
    [featureLists]
  );

  useEffect(() => {
    loadFeatureLists();
  }, [loadFeatureLists]);

  return {
    featureLists,
    loading,
    error,
    saveFeatureList,
    deleteFeatureList,
    reload: loadFeatureLists,
  };
}

/**
 * 版本配置管理 Hook
 */
export function useVersionConfigs() {
  const [versionConfigs, setVersionConfigs] = useState<VersionConfig[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载版本配置
  const loadVersionConfigs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 从 localStorage 加载
      const stored = localStorage.getItem(STORAGE_KEYS.VERSION_CONFIGS);
      const configs = stored ? JSON.parse(stored) : [];

      const currentVersionStored = localStorage.getItem(
        STORAGE_KEYS.CURRENT_VERSION
      );

      setVersionConfigs(configs);
      setCurrentVersion(currentVersionStored);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load version configs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 保存版本配置
  const saveVersionConfig = useCallback(
    async (versionConfig: Omit<VersionConfig, "createdAt" | "updatedAt">) => {
      try {
        const now = new Date().toISOString();
        const newConfig: VersionConfig = {
          ...versionConfig,
          createdAt: now,
          updatedAt: now,
        };

        const updatedConfigs = [
          ...versionConfigs.filter((c) => c.version !== newConfig.version),
          newConfig,
        ];
        setVersionConfigs(updatedConfigs);
        localStorage.setItem(
          STORAGE_KEYS.VERSION_CONFIGS,
          JSON.stringify(updatedConfigs)
        );

        return newConfig;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save version config"
        );
        throw err;
      }
    },
    [versionConfigs]
  );

  // 设置当前版本
  const setCurrentVersionConfig = useCallback(async (version: string) => {
    try {
      setCurrentVersion(version);
      localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, version);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to set current version"
      );
      throw err;
    }
  }, []);

  // 删除版本配置
  const deleteVersionConfig = useCallback(
    async (version: string) => {
      try {
        const updatedConfigs = versionConfigs.filter(
          (c) => c.version !== version
        );
        setVersionConfigs(updatedConfigs);
        localStorage.setItem(
          STORAGE_KEYS.VERSION_CONFIGS,
          JSON.stringify(updatedConfigs)
        );

        // 如果删除的是当前版本，清除当前版本
        if (currentVersion === version) {
          setCurrentVersion(null);
          localStorage.removeItem(STORAGE_KEYS.CURRENT_VERSION);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete version config"
        );
        throw err;
      }
    },
    [versionConfigs, currentVersion]
  );

  useEffect(() => {
    loadVersionConfigs();
  }, [loadVersionConfigs]);

  return {
    versionConfigs,
    currentVersion,
    loading,
    error,
    saveVersionConfig,
    setCurrentVersionConfig,
    deleteVersionConfig,
    reload: loadVersionConfigs,
  };
}

/**
 * 功能特性评估 Hook
 */
export function useFeatures(versionId?: string) {
  const { featureLists } = useFeatureLists();
  const { versionConfigs, currentVersion } = useVersionConfigs();
  const [userContext, setUserContext] = useState<UserContext>({});

  // 获取当前版本配置
  const activeVersion = useMemo(() => {
    const targetVersion = versionId || currentVersion;
    return versionConfigs.find((v) => v.version === targetVersion);
  }, [versionConfigs, currentVersion, versionId]);

  // 获取功能清单
  const featureList = useMemo(() => {
    if (!activeVersion) return null;
    // 这里简化实现，实际应该根据版本配置找到对应的功能清单
    return featureLists[0] || null;
  }, [featureLists, activeVersion]);

  // 评估所有功能
  const evaluatedFeatures = useMemo(() => {
    if (!featureList || !activeVersion) return [];

    return featureList.features.map((feature) => {
      const status = activeVersion.features[feature.id] || {
        enabled: feature.defaultEnabled,
      };
      return evaluateFeature(feature, status, userContext);
    });
  }, [featureList, activeVersion, userContext]);

  // 检查功能是否启用
  const isFeatureEnabled = useCallback(
    (featureId: string): boolean => {
      const evaluation = evaluatedFeatures.find(
        (e) => e.featureId === featureId
      );
      return evaluation?.enabled || false;
    },
    [evaluatedFeatures]
  );

  // 获取功能参数
  const getFeatureParams = useCallback(
    (featureId: string): Record<string, any> => {
      const evaluation = evaluatedFeatures.find(
        (e) => e.featureId === featureId
      );
      return evaluation?.params || {};
    },
    [evaluatedFeatures]
  );

  // 获取功能评估详情
  const getFeatureEvaluation = useCallback(
    (featureId: string): FeatureEvaluation | null => {
      return evaluatedFeatures.find((e) => e.featureId === featureId) || null;
    },
    [evaluatedFeatures]
  );

  // 更新用户上下文
  const updateUserContext = useCallback(
    (context: Partial<UserContext>) => {
      setUserContext((prev) => ({ ...prev, ...context }));
      localStorage.setItem(
        STORAGE_KEYS.USER_CONTEXT,
        JSON.stringify({ ...userContext, ...context })
      );
    },
    [userContext]
  );

  // 加载用户上下文
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_CONTEXT);
    if (stored) {
      try {
        setUserContext(JSON.parse(stored));
      } catch (err) {
        console.warn("Failed to parse stored user context:", err);
      }
    }
  }, []);

  return {
    features: evaluatedFeatures,
    activeVersion,
    featureList,
    userContext,
    isFeatureEnabled,
    getFeatureParams,
    getFeatureEvaluation,
    updateUserContext,
  };
}

/**
 * 简化的功能启用检查 Hook
 */
export function useFeatureEnabled(
  featureId: string,
  versionId?: string
): boolean {
  const { isFeatureEnabled } = useFeatures(versionId);
  return isFeatureEnabled(featureId);
}

/**
 * 功能参数获取 Hook
 */
export function useFeatureParams<T = Record<string, any>>(
  featureId: string,
  versionId?: string
): T {
  const { getFeatureParams } = useFeatures(versionId);
  return getFeatureParams(featureId) as T;
}

/**
 * 分页和搜索 Hook
 */
export function usePagination<T>(
  data: T[],
  options: {
    pageSize?: number;
    filters?: FilterParams;
    sort?: SortParams;
  } = {}
) {
  const [currentPage, setCurrentPage] = useState(1);
  const { pageSize = 10, filters, sort } = options;

  // 过滤数据
  const filteredData = useMemo(() => {
    let result = [...data];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((item: any) => {
        return JSON.stringify(item).toLowerCase().includes(searchLower);
      });
    }

    // 这里可以添加更多过滤逻辑

    return result;
  }, [data, filters]);

  // 排序数据
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (aValue < bValue) return sort.order === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sort]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // 分页信息
  const pagination = useMemo(() => {
    const total = sortedData.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
      current: currentPage,
      pageSize,
      total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }, [sortedData.length, currentPage, pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
    },
    [pagination.totalPages]
  );

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination.hasNext]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [pagination.hasPrev]);

  // 重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  return {
    data: paginatedData,
    pagination,
    goToPage,
    nextPage,
    prevPage,
  };
}

/**
 * 本地存储 Hook
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (err) {
      console.warn(`Failed to parse localStorage key "${key}":`, err);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(`Failed to set localStorage key "${key}":`, err);
      }
    },
    [key, value]
  );

  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Failed to remove localStorage key "${key}":`, err);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue] as const;
}
