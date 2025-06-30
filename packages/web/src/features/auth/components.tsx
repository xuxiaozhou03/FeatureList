import React from "react";
import { useFeatureConfig } from "@feature-list/shared";
import type { AuthFeatureConfig } from "@feature-list/shared";

export const LoginPage: React.FC = () => {
  const authConfig = useFeatureConfig<AuthFeatureConfig["config"]>("auth");

  return (
    <div className="auth-page">
      <h1>登录</h1>
      <form>
        <div>
          <label>用户名:</label>
          <input type="text" />
        </div>
        <div>
          <label>密码:</label>
          <input type="password" />
        </div>
        <button type="submit">登录</button>
      </form>

      {authConfig?.sso && (
        <div className="sso-section">
          <h3>单点登录</h3>
          <button>SSO登录</button>
        </div>
      )}

      {authConfig?.oauth?.google && (
        <button className="oauth-google">Google登录</button>
      )}

      {authConfig?.oauth?.github && (
        <button className="oauth-github">GitHub登录</button>
      )}
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  return (
    <div className="auth-page">
      <h1>注册</h1>
      <form>
        <div>
          <label>用户名:</label>
          <input type="text" />
        </div>
        <div>
          <label>邮箱:</label>
          <input type="email" />
        </div>
        <div>
          <label>密码:</label>
          <input type="password" />
        </div>
        <button type="submit">注册</button>
      </form>
    </div>
  );
};

export const UserProfile: React.FC = () => {
  return (
    <div className="user-profile">
      <h2>用户资料</h2>
      <p>用户名: admin</p>
      <p>邮箱: admin@example.com</p>
    </div>
  );
};
