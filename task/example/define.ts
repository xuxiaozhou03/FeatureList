export interface IVerson {
  name: string; // 版本名称
  description?: string; // 版本描述
  // 版本功能列表
  features: {
    // 用户管理
    user: {
      enabled: boolean; // 是否启用用户管理功能
      config: {
        // 是否允许批量删除用户
        allowBatchDelete: boolean;
        // 是否允许批量添加用户
        allowBatchAdd: boolean;
      };
      // 新增用户
      addUser: {
        enabled: boolean; // 是否启用新增用户功能
        config: {
          // 是否允许设置用户角色
          allowSetRole: boolean;
          // 是否允许设置用户权限
          allowSetPermission: boolean;
        };
      };
      // 删除用户
      deleteUser: {
        enabled: boolean; // 是否启用删除用户功能
        config: {
          // 删除前确认
          confirmBeforeDelete: boolean;
        };
      };
    };
  };
}
