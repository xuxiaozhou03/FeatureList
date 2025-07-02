import { useFeatures } from "../hooks/useFeatures";

export default function Dashboard() {
  const features = useFeatures();

  if (features.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (features.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading dashboard configuration
        </div>
      </div>
    );
  }

  if (!features.isFeatureEnabled("dashboard")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">
          Dashboard is not available in this version
        </div>
      </div>
    );
  }

  const dashboardParams = features.getFeatureParams("dashboard");
  const widgets = dashboardParams.widgets || [];
  const theme = dashboardParams.theme || "basic";

  return (
    <div className={`dashboard theme-${theme} p-6`}>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {widgets.map((widget: string) => (
          <div
            key={widget}
            className={`widget widget-${widget} bg-white rounded-lg shadow p-4`}
          >
            <h3 className="text-lg font-semibold mb-2 capitalize">{widget}</h3>
            <div className="text-gray-600">
              {widget === "overview" && "System overview information"}
              {widget === "recent" && "Recent activities"}
              {widget === "analytics" && "Analytics data (Enterprise feature)"}
              {widget === "reports" && "Report generation (Enterprise feature)"}
            </div>
          </div>
        ))}
      </div>

      {features.isFeatureEnabled("projects") && (
        <div className="projects-section bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                Max projects:{" "}
                <span className="font-semibold">
                  {features.getFeatureParams("projects").maxProjects}
                </span>
              </p>
              <p className="text-gray-600">
                Available templates:{" "}
                {features.getFeatureParams("projects").templates?.join(", ")}
              </p>
            </div>

            {features.isFeatureEnabled("projects.pipelines") && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Pipelines</h3>
                <p className="text-gray-600">
                  Max pipelines:{" "}
                  <span className="font-semibold">
                    {
                      features.getFeatureParams("projects.pipelines")
                        .maxPipelines
                    }
                  </span>
                </p>
                <p className="text-gray-600">
                  Concurrent runs:{" "}
                  <span className="font-semibold">
                    {features.getFeatureParams("projects.pipelines").concurrent}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {features.isFeatureEnabled("issues") && (
        <div className="issues-section bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Issues</h2>
          <p className="text-gray-600">
            Max issues:{" "}
            <span className="font-semibold">
              {features.getFeatureParams("issues").maxIssues}
            </span>
          </p>
          <p className="text-gray-600">
            Workflow types:{" "}
            {features.getFeatureParams("issues").workflowTypes?.join(", ")}
          </p>
        </div>
      )}

      {features.code?.enabled && (
        <div className="code-section bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Code Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.code.params.repositories && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Repositories enabled</span>
              </div>
            )}
            {features.code.params.codeReview && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Code review enabled</span>
              </div>
            )}
            {features.code.params.branches && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Branches: {features.code.params.branches}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
