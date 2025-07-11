import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Spin } from "antd";

interface MonacoJsonEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  readOnly?: boolean;
  language?: string;
  theme?: string;
  schema?: object;
}

const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value = "",
  onChange,
  height = 400,
  readOnly = false,
  language = "json",
  theme = "vs",
  schema,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) => {
    editorRef.current = editor;
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      wordWrap: "on",
      folding: true,
      readOnly: readOnly,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: "boundary",
      showFoldingControls: "always",
      smoothScrolling: true,
      cursorSmoothCaretAnimation: "on",
      formatOnPaste: true,
      formatOnType: true,
    });
    // 动态注册 JSON schema
    if (language === "json" && schema) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [
          {
            uri: "inmemory://model/schema.json",
            fileMatch: ["*"],
            schema: schema,
          },
        ],
      });
    }
    setTimeout(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    }, 100);
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (onChange && newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={value}
      theme={theme}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      loading={<Spin size="large" />}
      options={{
        selectOnLineNumbers: true,
        roundedSelection: false,
        cursorStyle: "line",
        automaticLayout: true,
      }}
    />
  );
};

export default MonacoJsonEditor;
