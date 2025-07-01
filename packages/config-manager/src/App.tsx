import { useState, useEffect } from "react";

interface FeatureConfig {
  name: string;
  enabled: boolean;
  version: string;
  description: string;
  icon: string;
}

interface VersionConfig {
  version: string;
  name: string;
  description: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
  };
  features: Record<string, FeatureConfig>;
}

const defaultFeatures: Record<string, FeatureConfig> = {
  "user-management": {
    name: "用户管理",
    enabled: false,
    version: "1.0.0",
    description: "基础用户管理功能",
    icon: "👥",
  },
  "basic-dashboard": {
    name: "基础仪表板",
    enabled: false,
    version: "1.0.0",
    description: "基础的数据展示面板",
    icon: "📊",
  },
  "file-upload": {
    name: "文件上传",
    enabled: false,
    version: "1.0.0",
    description: "基础文件上传功能",
    icon: "📁",
  },
  "advanced-dashboard": {
    name: "高级仪表板",
    enabled: false,
    version: "1.0.0",
    description: "高级数据分析和可视化",
    icon: "📈",
  },
  "batch-operations": {
    name: "批量操作",
    enabled: false,
    version: "1.0.0",
    description: "批量数据处理功能",
    icon: "⚡",
  },
  "data-export": {
    name: "数据导出",
    enabled: false,
    version: "1.0.0",
    description: "多格式数据导出功能",
    icon: "💾",
  },
  "advanced-analytics": {
    name: "高级分析",
    enabled: false,
    version: "1.0.0",
    description: "企业级数据分析和预测",
    icon: "🔍",
  },
  "api-integration": {
    name: "API集成",
    enabled: false,
    version: "1.0.0",
    description: "第三方API集成和管理",
    icon: "🔗",
  },
  "role-permissions": {
    name: "角色权限",
    enabled: false,
    version: "1.0.0",
    description: "细粒度的角色权限管理",
    icon: "🔐",
  },
  "audit-logs": {
    name: "审计日志",
    enabled: false,
    version: "1.0.0",
    description: "完整的操作审计追踪",
    icon: "📋",
  },
};

const presetConfigs = {
  basic: {
    features: ["user-management", "basic-dashboard", "file-upload"],
  },
  pro: {
    features: [
      "user-management",
      "basic-dashboard",
      "file-upload",
      "advanced-dashboard",
      "batch-operations",
      "data-export",
    ],
  },
  enterprise: {
    features: Object.keys(defaultFeatures),
  },
};

function App() {
  const [configs, setConfigs] = useState<Record<string, VersionConfig>>({});
  const [currentVersion, setCurrentVersion] = useState("basic");
  const [currentConfig, setCurrentConfig] = useState<VersionConfig>({
    version: "basic",
    name: "基础版本",
    description: "适合个人用户和小团队的基础功能版本",
    theme: {
      primaryColor: "#007acc",
      backgroundColor: "#ffffff",
    },
    features: { ...defaultFeatures },
  });

  // 加载现有配置
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const versions = ["basic", "pro", "enterprise"];
        const configPromises = versions.map(async (version) => {
          try {
            const response = await fetch(`/configs/${version}.json`);
            if (response.ok) {
              return { version, config: await response.json() };
            }
          } catch (error) {
            console.warn(`无法加载 ${version} 配置:`, error);
          }
          return null;
        });

        const results = await Promise.all(configPromises);
        const loadedConfigs: Record<string, VersionConfig> = {};

        results.forEach((result) => {
          if (result) {
            loadedConfigs[result.version] = result.config;
          }
        });

        setConfigs(loadedConfigs);

        if (loadedConfigs[currentVersion]) {
          setCurrentConfig(loadedConfigs[currentVersion]);
        }
      } catch (error) {
        console.error("加载配置失败:", error);
      }
    };

    loadConfigs();
  }, [currentVersion]);

  const handleVersionChange = (version: string) => {
    setCurrentVersion(version);
    if (configs[version]) {
      setCurrentConfig(configs[version]);
    } else {
      // 创建新配置
      const preset = presetConfigs[version as keyof typeof presetConfigs];
      const newFeatures = { ...defaultFeatures };

      if (preset) {
        Object.keys(newFeatures).forEach((key) => {
          newFeatures[key].enabled = preset.features.includes(key);
        });
      }

      setCurrentConfig({
        version,
        name:
          version === "basic"
            ? "基础版本"
            : version === "pro"
            ? "专业版本"
            : "企业版本",
        description: `${version} 版本配置`,
        theme: {
          primaryColor:
            version === "basic"
              ? "#007acc"
              : version === "pro"
              ? "#28a745"
              : "#6f42c1",
          backgroundColor: "#ffffff",
        },
        features: newFeatures,
      });
    }
  };

  const handleFeatureToggle = (featureKey: string) => {
    setCurrentConfig((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureKey]: {
          ...prev.features[featureKey],
          enabled: !prev.features[featureKey].enabled,
        },
      },
    }));
  };

  const handleConfigChange = (field: string, value: any) => {
    if (field.startsWith("theme.")) {
      const themeField = field.split(".")[1];
      setCurrentConfig((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          [themeField]: value,
        },
      }));
    } else {
      setCurrentConfig((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSaveConfig = () => {
    const dataStr = JSON.stringify(currentConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentConfig.version}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePreviewConfig = () => {
    // 在新窗口中预览配置
    const previewUrl = `/?version=${currentConfig.version}`;
    window.open(previewUrl, "_blank");
  };

  const enabledCount = Object.values(currentConfig.features).filter(
    (f) => f.enabled
  ).length;
  const totalCount = Object.keys(currentConfig.features).length;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ color: "#333", margin: "0 0 10px 0" }}>
          🛠️ 功能清单配置管理器
        </h1>
        <p style={{ color: "#666", margin: "0" }}>
          在线生成和管理不同版本的功能配置
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "20px",
        }}
      >
        {/* 左侧控制面板 */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: "fit-content",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>版本配置</h3>

          {/* 版本选择 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              版本类型:
            </label>
            <select
              value={currentVersion}
              onChange={(e) => handleVersionChange(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              <option value="basic">基础版本</option>
              <option value="pro">专业版本</option>
              <option value="enterprise">企业版本</option>
            </select>
          </div>

          {/* 基本信息 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              版本名称:
            </label>
            <input
              type="text"
              value={currentConfig.name}
              onChange={(e) => handleConfigChange("name", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              版本描述:
            </label>
            <textarea
              value={currentConfig.description}
              onChange={(e) =>
                handleConfigChange("description", e.target.value)
              }
              rows={3}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                resize: "vertical",
              }}
            />
          </div>

          {/* 主题设置 */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>主题设置</h4>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                主色调:
              </label>
              <input
                type="color"
                value={currentConfig.theme.primaryColor}
                onChange={(e) =>
                  handleConfigChange("theme.primaryColor", e.target.value)
                }
                style={{
                  width: "100%",
                  height: "40px",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                背景色:
              </label>
              <input
                type="color"
                value={currentConfig.theme.backgroundColor}
                onChange={(e) =>
                  handleConfigChange("theme.backgroundColor", e.target.value)
                }
                style={{
                  width: "100%",
                  height: "40px",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* 功能统计 */}
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}
            >
              功能统计
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: currentConfig.theme.primaryColor,
              }}
            >
              {enabledCount}/{totalCount}
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              {Math.round((enabledCount / totalCount) * 100)}% 功能启用
            </div>
          </div>

          {/* 操作按钮 */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={handlePreviewConfig}
              style={{
                padding: "10px",
                backgroundColor: currentConfig.theme.primaryColor,
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              🔍 预览效果
            </button>
            <button
              onClick={handleSaveConfig}
              style={{
                padding: "10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              💾 导出配置
            </button>
          </div>
        </div>

        {/* 右侧功能配置 */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>功能模块配置</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "15px",
            }}
          >
            {Object.entries(currentConfig.features).map(([key, feature]) => (
              <div
                key={key}
                style={{
                  border: `2px solid ${
                    feature.enabled
                      ? currentConfig.theme.primaryColor
                      : "#e9ecef"
                  }`,
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: feature.enabled ? "#f8f9ff" : "#f8f9fa",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onClick={() => handleFeatureToggle(key)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "20px", marginRight: "10px" }}>
                      {feature.icon}
                    </span>
                    <h4
                      style={{
                        margin: "0",
                        color: feature.enabled
                          ? currentConfig.theme.primaryColor
                          : "#6c757d",
                      }}
                    >
                      {feature.name}
                    </h4>
                  </div>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: feature.enabled
                        ? currentConfig.theme.primaryColor
                        : "#dee2e6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {feature.enabled ? "✓" : ""}
                  </div>
                </div>
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "13px",
                    color: "#666",
                    lineHeight: "1.4",
                  }}
                >
                  {feature.description}
                </p>
                <div style={{ fontSize: "11px", color: "#999" }}>
                  版本: {feature.version}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
