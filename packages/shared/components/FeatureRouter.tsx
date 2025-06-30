import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useFeatureContext } from "../contexts/FeatureContext";
import type { RouteConfig } from "../../versions/feature";

const FeatureRoute: React.FC<{
  route: RouteConfig;
}> = ({ route }) => {
  const { isEnabled } = useFeatureContext();

  // 如果指定了功能开关且功能未启用，返回404或重定向
  if (route.feature && !isEnabled(route.feature)) {
    return <Route path={route.path} element={<Navigate to="/404" replace />} />;
  }

  const Component = route.component;
  return (
    <Route path={route.path} element={<Component />}>
      {route.children?.map((childRoute, index) => (
        <FeatureRoute key={index} route={childRoute} />
      ))}
    </Route>
  );
};

export const FeatureRouter: React.FC<{
  routes: RouteConfig[];
}> = ({ routes }) => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <FeatureRoute key={index} route={route} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
