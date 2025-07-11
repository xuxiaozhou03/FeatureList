import React from "react";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";
import MonacoJsonEditor from "./MonacoJsonEditor";
import Wrapper from "./Wrapper";

const DefineFeaturesEditorTab: React.FC = () => {
  const { schemaStr, setSchemaStr, featureConfigSchema } =
    useDefineFeatureSchema();

  return (
    <Wrapper
      title="功能定义编辑器"
      description="定义功能的结构和参数Schema约束，支持嵌套功能和参数验证"
    >
      <MonacoJsonEditor
        value={schemaStr}
        height={500}
        schema={featureConfigSchema}
        onChange={(value) => {
          setSchemaStr(value);
        }}
      />
    </Wrapper>
  );
};

export default DefineFeaturesEditorTab;
