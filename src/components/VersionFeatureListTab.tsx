import React from "react";
import Wrapper from "./Wrapper";
import MonacoJsonEditor from "./MonacoJsonEditor";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";

const VersionFeatureListTab: React.FC = () => {
  const { versionSchema } = useDefineFeatureSchema();

  return (
    <Wrapper
      title="版本/功能清单 JSON Schema 约束文件展示"
      description="此处展示根据功能定义自动生成的 JSON Schema 约束文件，可用于校验版本及功能清单填写。"
    >
      <MonacoJsonEditor
        schema={{}}
        value={JSON.stringify(versionSchema, null, 2)}
        height={400}
        readOnly
      />
    </Wrapper>
  );
};

export default VersionFeatureListTab;
