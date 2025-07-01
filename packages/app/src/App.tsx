import { useVersionConfig } from "@feature-list/shared";

function App() {
  const { config, loading, error } = useVersionConfig();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
          fontSize: "18px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "10px" }}>⏳</div>
          <div>正在加载配置...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            border: "2px solid #dc3545",
            borderRadius: "8px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
          }}
        >
          <h2 style={{ margin: "0 0 10px 0" }}>❌ 配置加载失败</h2>
          <p style={{ margin: "0" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  const enabledFeatures = featureToggle.getEnabledFeatures();
  const versionInfo = featureToggle.getVersionInfo();

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: config.theme.backgroundColor,
        minHeight: "100vh",
      }}
    >
      {/* 版本切换器 */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        <select
          value={config.version}
          onChange={(e) => {
            const newVersion = e.target.value;
            const url = new URL(window.location.href);
            url.searchParams.set("version", newVersion);
            window.location.href = url.toString();
          }}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: `1px solid ${config.theme.primaryColor}`,
            backgroundColor: "white",
            color: config.theme.primaryColor,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="basic">基础版本</option>
          <option value="pro">专业版本</option>
          <option value="enterprise">企业版本</option>
        </select>
        <button
          onClick={() => window.open("/config-manager", "_blank")}
          style={{
            padding: "8px 12px",
            backgroundColor: config.theme.primaryColor,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          配置管理
        </button>
      </div>

      {/* 主要内容 */}
      <header
        style={{
          marginBottom: "30px",
          borderBottom: `3px solid ${config.theme.primaryColor}`,
          paddingBottom: "15px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginRight: "200px",
        }}
      >
        <h1
          style={{
            color: config.theme.primaryColor,
            margin: "0",
            fontSize: "2.5em",
          }}
        >
          🚀 {config.name}
        </h1>
        <p style={{ margin: "15px 0 5px 0", color: "#666", fontSize: "1.1em" }}>
          {config.description}
        </p>
        <p style={{ margin: "5px 0 0 0", color: "#999", fontSize: "1em" }}>
          版本: {versionInfo.version} | 启用功能: {versionInfo.enabledFeatures}/
          {versionInfo.totalFeatures}
        </p>
      </header>

      <main>
        {/* 功能概览 */}
        <section style={{ marginBottom: "30px" }}>
          <h2
            style={{
              color: "#333",
              borderBottom: `2px solid ${config.theme.primaryColor}`,
              paddingBottom: "8px",
              fontSize: "1.8em",
            }}
          >
            🎯 功能模块
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {Object.entries(config.features).map(([key, feature]) => (
              <div
                key={key}
                style={{
                  border: `2px solid ${
                    feature.enabled ? config.theme.primaryColor : "#e9ecef"
                  }`,
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: feature.enabled ? "white" : "#f8f9fa",
                  boxShadow: feature.enabled
                    ? "0 4px 6px rgba(0,0,0,0.1)"
                    : "none",
                  opacity: feature.enabled ? 1 : 0.6,
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ fontSize: "24px", marginRight: "12px" }}>
                    {feature.icon}
                  </span>
                  <h3
                    style={{
                      margin: "0",
                      color: feature.enabled
                        ? config.theme.primaryColor
                        : "#6c757d",
                      fontSize: "1.3em",
                    }}
                  >
                    {feature.name}
                  </h3>
                </div>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "14px",
                    color: "#666",
                    lineHeight: "1.5",
                  }}
                >
                  {feature.description}
                </p>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>版本: {feature.version}</span>
                  <span
                    style={{
                      backgroundColor: feature.enabled ? "#28a745" : "#6c757d",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "10px",
                    }}
                  >
                    {feature.enabled ? "已启用" : "未启用"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 功能演示区域 */}
        <section>
          <h2
            style={{
              color: "#333",
              borderBottom: `2px solid ${config.theme.primaryColor}`,
              paddingBottom: "8px",
              fontSize: "1.8em",
            }}
          >
            💡 功能演示
          </h2>
          <div style={{ marginTop: "20px", display: "grid", gap: "20px" }}>
            {/* 只显示启用的功能 */}
            {enabledFeatures.map((feature) => (
              <div
                key={feature.featureName}
                style={{
                  padding: "25px",
                  border: `2px solid ${config.theme.primaryColor}20`,
                  borderRadius: "12px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 15px 0",
                    color: config.theme.primaryColor,
                    fontSize: "1.4em",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>{feature.icon}</span>
                  {feature.name}
                </h3>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  {feature.description}
                </p>

                {/* 根据功能类型渲染不同的演示内容 */}
                {renderFeatureDemo(
                  feature.featureName,
                  config.theme.primaryColor
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        style={{
          marginTop: "50px",
          padding: "30px 0",
          borderTop: `2px solid ${config.theme.primaryColor}`,
          textAlign: "center",
          color: "#666",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: config.theme.primaryColor,
            marginBottom: "10px",
          }}
        >
          🏢 功能清单演示平台
        </div>
        <p style={{ margin: "0", fontSize: "14px" }}>
          基于动态配置的多版本部署演示 - {config.name}
        </p>
      </footer>
    </div>
  );
}

// 根据功能名称渲染对应的演示内容
function renderFeatureDemo(featureName: string, primaryColor: string) {
  switch (featureName) {
    case "user-management":
      return (
        <div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: primaryColor,
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              用户列表
            </button>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              添加用户
            </button>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              权限管理
            </button>
          </div>
        </div>
      );

    case "basic-dashboard":
    case "advanced-dashboard":
      return (
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div
            style={{
              padding: "15px",
              backgroundColor: `${primaryColor}20`,
              borderRadius: "4px",
              textAlign: "center",
              minWidth: "100px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: primaryColor,
              }}
            >
              1,234
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>用户总数</div>
          </div>
          <div
            style={{
              padding: "15px",
              backgroundColor: `${primaryColor}20`,
              borderRadius: "4px",
              textAlign: "center",
              minWidth: "100px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: primaryColor,
              }}
            >
              5,678
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>数据量</div>
          </div>
          <div
            style={{
              padding: "15px",
              backgroundColor: `${primaryColor}20`,
              borderRadius: "4px",
              textAlign: "center",
              minWidth: "100px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: primaryColor,
              }}
            >
              92.5%
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>系统健康度</div>
          </div>
        </div>
      );

    case "file-upload":
      return (
        <div>
          <div
            style={{
              border: "2px dashed #ddd",
              padding: "20px",
              textAlign: "center",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          >
            <p style={{ margin: "0", color: "#666" }}>
              拖拽文件到这里或点击选择文件
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="file" multiple style={{ flex: 1 }} />
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: primaryColor,
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              上传文件
            </button>
          </div>
        </div>
      );

    case "batch-operations":
      return (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            批量导入
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            批量删除
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: primaryColor,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            批量更新
          </button>
        </div>
      );

    case "data-export":
      return (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option>Excel (.xlsx)</option>
            <option>CSV (.csv)</option>
            <option>JSON (.json)</option>
            <option>PDF (.pdf)</option>
          </select>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: primaryColor,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            导出数据
          </button>
        </div>
      );

    default:
      return (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: primaryColor,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            功能操作
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            设置
          </button>
        </div>
      );
  }
}

export default App;
