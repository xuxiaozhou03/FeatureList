import { useLocalStorageState } from "ahooks";
import React from "react";
import { generateVersionSchema } from "../utils/generateVersionSchema";
import { schemaToTypescript } from "../utils/schemaToTypescript";

export type DefineFeature = {
  name: string;
  description: string;
  config?: Record<
    string,
    {
      name: string;
      type: string;
      description: string;
      default?: string | number | boolean;
      required?: boolean;
      enum?: Array<string | number>;
      enumDesc?: string[];
    }
  >;
  [key: string]:
    | DefineFeature
    | string
    | number
    | boolean
    | Record<string, unknown>
    | undefined;
};
export type FeatureJson = Record<string, DefineFeature>;

const defaultJson: FeatureJson = {
  user: {
    name: "用户管理",
    description: "管理系统中的用户，包括新增、编辑、删除等操作",
    config: {
      allowBatchDelete: {
        name: "是否允许批量删除用户",
        type: "boolean",
        description: "是否允许批量删除用户",
        default: false,
        required: true,
      },
      maxUsers: {
        name: "最大用户数",
        type: "number",
        description: "最大用户数",
        default: 100,
        required: true,
      },
      userRole: {
        name: "用户角色",
        type: "string",
        description: "用户角色类型，决定用户权限范围",
        enum: ["admin", "user", "guest", "supervisor", "auditor"],
        enumDesc: ["管理员", "普通用户", "访客", "主管", "审计员"],
        default: "user",
        required: true,
      },
      userStatus: {
        name: "用户状态",
        type: "string",
        description: "当前用户的激活状态",
        enum: ["active", "inactive", "pending", "banned"],
        enumDesc: ["激活", "未激活", "待审核", "已封禁"],
        default: "active",
        required: false,
      },
      userDepartment: {
        name: "所属部门",
        type: "string",
        description: "用户所属的部门名称",
        enum: ["IT", "HR", "Finance", "Sales", "Marketing"],
        enumDesc: ["技术部", "人力资源部", "财务部", "销售部", "市场部"],
        default: "IT",
        required: false,
      },
    },
    addUser: {
      name: "新增用户",
      description: "添加新用户",
      config: {
        requireEmail: {
          name: "是否必须填写邮箱",
          type: "boolean",
          description: "是否必须填写邮箱",
          default: true,
          required: true,
        },
      },
    },
    deleteUser: {
      name: "删除用户",
      description: "删除现有用户",
      config: {
        confirmBeforeDelete: {
          name: "删除前是否需要确认",
          type: "boolean",
          description: "删除前是否需要确认",
          default: true,
          required: true,
        },
      },
    },
  },
};
export function useFeatureJson() {
  const [json, setJson] = useLocalStorageState<FeatureJson>("featureListJson", {
    defaultValue: defaultJson,
  });
  const versionSchema = React.useMemo(
    () => (json ? generateVersionSchema(json) : null),
    [json]
  );
  const tsDef = React.useMemo(
    () => (versionSchema ? schemaToTypescript(versionSchema) : "暂无类型定义"),
    [versionSchema]
  );

  return {
    json,
    jsonString: JSON.stringify(json, null, 2),
    setJson: (str: string) => {
      setJson(str === "" ? {} : (JSON.parse(str) as FeatureJson));
    },
    versionSchema,
    tsDef,
  };
}
