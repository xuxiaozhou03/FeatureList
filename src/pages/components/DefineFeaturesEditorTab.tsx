import React from "react";
import MonacoJsonEditor from "./MonacoJsonEditor";
import useDefineFeatureSchema from "../hooks/useDefineFeatureSchema";

const DefineFeaturesEditorTab: React.FC = () => {
  const { data, setData, featureConfigSchema } = useDefineFeatureSchema();

  return (
    <div>
      <MonacoJsonEditor
        value={data}
        height={500}
        schema={featureConfigSchema}
        onChange={(value) => {
          setData(value);
        }}
      />
    </div>
  );
};

export default DefineFeaturesEditorTab;
