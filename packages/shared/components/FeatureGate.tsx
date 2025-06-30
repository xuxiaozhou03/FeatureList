import React, { type ReactNode } from "react";
import { useFeature } from "../hooks/useFeature";

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  mode?: "show" | "hide" | "redirect";
  redirectTo?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback = null,
  mode = "show",
}) => {
  const isEnabled = useFeature(feature);

  if (mode === "hide") {
    return isEnabled ? null : <>{children}</>;
  }

  return isEnabled ? <>{children}</> : <>{fallback}</>;
};

// HOC 方式的功能控制
export const withFeature = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureId: string,
  fallback?: React.ComponentType<P>
) => {
  return (props: P) => {
    const isEnabled = useFeature(featureId);

    if (!isEnabled && fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent {...props} />;
    }

    return isEnabled ? <WrappedComponent {...props} /> : null;
  };
};
