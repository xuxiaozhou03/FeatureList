import React from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorDemoProps {
  mode: "markdown" | "richtext";
}

const EditorDemo: React.FC<EditorDemoProps> = ({ mode }) => {
  const [value, setValue] = React.useState<string>("");

  if (mode === "markdown") {
    return (
      <MDEditor value={value} onChange={(val) => setValue(val!)} height={200} />
    );
  }
  return (
    <ReactQuill
      value={value}
      onChange={setValue}
      theme="snow"
      style={{ height: 200 }}
    />
  );
};

export default EditorDemo;
