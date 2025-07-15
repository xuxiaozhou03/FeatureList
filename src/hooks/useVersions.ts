import { useLocalStorageState } from "ahooks";

export interface IVersion {
  /** 英文版本名称，如：enterprise, community */
  name: string;
  /** 版本说明或备注信息 */
  description: string;
  features: {
    /** 管理系统中的用户，包括新增、编辑、删除等操作 */
    user: {
      /** 是否启用用户管理功能 */
      enabled: boolean;
      config: {
        /** 是否允许批量删除用户 */
        allowBatchDelete: boolean;
        /** 最大用户数 */
        maxUsers: number;
        /** 用户角色类型，决定用户权限范围 */
        userRole: string;
        /** 当前用户的激活状态 */
        userStatus: string;
        /** 用户所属的部门名称 */
        userDepartment: string;
      };
      /** 添加新用户 */
      addUser: {
        /** 是否启用新增用户功能 */
        enabled: boolean;
        config: {
          /** 是否必须填写邮箱 */
          requireEmail: boolean;
        };
      };
      /** 删除现有用户 */
      deleteUser: {
        /** 是否启用删除用户功能 */
        enabled: boolean;
        config: {
          /** 删除前是否需要确认 */
          confirmBeforeDelete: boolean;
        };
      };
    };
  };
}

const initialVersions: IVersion[] = [
  {
    name: "Enterprise",
    description: "企业版",
    features: {
      user: {
        enabled: true,
        config: {
          allowBatchDelete: true,
          maxUsers: 1000,
          userRole: "admin",
          userStatus: "active",
          userDepartment: "IT",
        },
        addUser: {
          enabled: true,
          config: {
            requireEmail: true,
          },
        },
        deleteUser: {
          enabled: true,
          config: {
            confirmBeforeDelete: true,
          },
        },
      },
    },
  },
  {
    name: "Community",
    description: "社区版",
    features: {
      user: {
        enabled: true,
        config: {
          allowBatchDelete: false,
          maxUsers: 100,
          userRole: "user",
          userStatus: "active",
          userDepartment: "IT",
        },
        addUser: {
          enabled: true,
          config: {
            requireEmail: false,
          },
        },
        deleteUser: {
          enabled: false,
          config: {
            confirmBeforeDelete: false,
          },
        },
      },
    },
  },
];

export const useVersions = () => {
  const [versions, setVersions] = useLocalStorageState<IVersion[]>("versions", {
    defaultValue: initialVersions,
  });

  return {
    versions,
    setVersions,
  };
};
