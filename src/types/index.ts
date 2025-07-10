// 功能特性配置类型
export interface FeatureConfig {
  /** 功能唯一标识符 */
  id: string;
  /** 功能名称 */
  name: string;
  /** 功能描述 */
  description?: string;
  /** 功能类型 */
  type: "feature" | "experiment" | "rollout" | "permission" | "group";
  /** 是否默认启用 */
  defaultEnabled: boolean;
  /** 功能参数配置 */
  params?: Record<string, any>;
  /** 依赖的其他功能 */
  dependencies?: string[];
  /** 互斥的功能（不能同时启用） */
  conflicts?: string[];
  /** 功能标签 */
  tags?: string[];
  /** 父功能ID（用于嵌套结构） */
  parentId?: string;
  /** 子功能列表（嵌套功能） */
  children?: FeatureConfig[];
  /** 功能层级（根功能为0） */
  level?: number;
  /** 排序权重 */
  order?: number;
  /** 是否可展开（用于UI显示） */
  expandable?: boolean;
  /** 默认展开状态 */
  expanded?: boolean;
  /** 功能图标 */
  icon?: string;
  /** 功能颜色（用于UI区分） */
  color?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 创建者 */
  createdBy?: string;
}

// 功能特性清单
export interface FeatureList {
  /** 清单版本 */
  version: string;
  /** 清单名称 */
  name: string;
  /** 清单描述 */
  description?: string;
  /** 功能特性列表 */
  features: FeatureConfig[];
  /** JSON Schema 定义 */
  schema?: any;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

// 版本配置类型
export interface VersionConfig {
  /** 版本标识 */
  version: string;
  /** 版本名称 */
  name: string;
  /** 版本描述 */
  description?: string;
  /** 环境（dev, test, staging, prod） */
  environment: "dev" | "test" | "staging" | "prod";
  /** 功能启用状态映射 */
  features: Record<string, FeatureStatus>;
  /** 是否为默认版本 */
  isDefault?: boolean;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 创建者 */
  createdBy?: string;
}

// 功能状态类型
export interface FeatureStatus {
  /** 是否启用 */
  enabled: boolean;
  /** 功能参数（覆盖默认参数） */
  params?: Record<string, any>;
  /** 启用条件（基于用户、设备等） */
  conditions?: FeatureCondition[];
  /** 灰度发布配置 */
  rollout?: RolloutConfig;
}

// 功能启用条件
export interface FeatureCondition {
  /** 条件类型 */
  type: "user" | "device" | "location" | "time" | "percentage" | "custom";
  /** 条件操作符 */
  operator: "equals" | "in" | "contains" | "greater" | "less" | "between";
  /** 条件值 */
  value: any;
  /** 条件字段 */
  field?: string;
}

// 灰度发布配置
export interface RolloutConfig {
  /** 发布策略 */
  strategy: "percentage" | "whitelist" | "gradual";
  /** 发布百分比（0-100） */
  percentage?: number;
  /** 白名单用户 */
  whitelist?: string[];
  /** 渐进式发布配置 */
  gradual?: {
    /** 起始百分比 */
    start: number;
    /** 结束百分比 */
    end: number;
    /** 增长步长 */
    step: number;
    /** 步长间隔（分钟） */
    interval: number;
  };
}

// 用户上下文
export interface UserContext {
  /** 用户ID */
  userId?: string;
  /** 用户组 */
  userGroup?: string;
  /** 设备信息 */
  device?: {
    type: "mobile" | "tablet" | "desktop";
    os: string;
    browser: string;
  };
  /** 地理位置 */
  location?: {
    country: string;
    region: string;
    city: string;
  };
  /** 自定义属性 */
  custom?: Record<string, any>;
}

// 功能评估结果
export interface FeatureEvaluation {
  /** 功能ID */
  featureId: string;
  /** 是否启用 */
  enabled: boolean;
  /** 功能参数 */
  params: Record<string, any>;
  /** 评估原因 */
  reason: string;
  /** 评估时间 */
  evaluatedAt: string;
}

// Schema 验证结果
export interface SchemaValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 错误信息 */
  errors?: Array<{
    path: string;
    message: string;
    value?: any;
  }>;
}

// API 响应类型
export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean;
  /** 数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  code?: string;
}

// 分页响应类型
export interface PaginatedResponse<T = any> {
  /** 数据列表 */
  items: T[];
  /** 总数 */
  total: number;
  /** 当前页 */
  page: number;
  /** 每页大小 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}

// 排序参数
export interface SortParams {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  order: "asc" | "desc";
}

// 过滤参数
export interface FilterParams {
  /** 搜索关键词 */
  search?: string;
  /** 功能类型 */
  type?: FeatureConfig["type"];
  /** 标签 */
  tags?: string[];
  /** 环境 */
  environment?: VersionConfig["environment"];
  /** 启用状态 */
  enabled?: boolean;
}

// 导出选项
export interface ExportOptions {
  /** 导出格式 */
  format: "json" | "yaml" | "csv";
  /** 是否包含元数据 */
  includeMetadata?: boolean;
  /** 过滤条件 */
  filters?: FilterParams;
}

// 导入选项
export interface ImportOptions {
  /** 导入模式 */
  mode: "merge" | "replace" | "append";
  /** 是否验证 Schema */
  validateSchema?: boolean;
  /** 是否备份现有数据 */
  createBackup?: boolean;
}

// 功能树节点类型
export interface FeatureTreeNode extends FeatureConfig {
  /** 子节点 */
  children: FeatureTreeNode[];
  /** 是否展开 */
  expanded: boolean;
  /** 缩进层级 */
  indent: number;
  /** 是否为叶子节点 */
  isLeaf: boolean;
  /** 完整路径 */
  path: string[];
}

// 功能组配置
export interface FeatureGroup {
  /** 组ID */
  id: string;
  /** 组名称 */
  name: string;
  /** 组描述 */
  description?: string;
  /** 组图标 */
  icon?: string;
  /** 组颜色 */
  color?: string;
  /** 包含的功能列表 */
  features: string[];
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 默认折叠状态 */
  collapsed?: boolean;
  /** 排序权重 */
  order?: number;
}

// 嵌套功能操作类型
export interface NestedFeatureOperation {
  /** 操作类型 */
  type: "add" | "move" | "delete" | "update" | "reorder";
  /** 目标功能ID */
  featureId: string;
  /** 父功能ID */
  parentId?: string;
  /** 新位置索引 */
  newIndex?: number;
  /** 操作数据 */
  data?: Partial<FeatureConfig>;
}

// 功能清单树形配置
export interface FeatureListTreeConfig {
  /** 是否启用树形结构 */
  enableTree: boolean;
  /** 最大嵌套层级 */
  maxDepth: number;
  /** 是否允许拖拽 */
  allowDrag: boolean;
  /** 是否显示连接线 */
  showLine: boolean;
  /** 是否显示图标 */
  showIcon: boolean;
  /** 默认展开层级 */
  defaultExpandLevel: number;
}
