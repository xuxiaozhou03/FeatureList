import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Spin } from "antd";

interface MonacoJsonEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  schema?: any;
  readOnly?: boolean;
  language?: string;
  theme?: string;
}

const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value = "",
  onChange,
  height = 400,
  schema,
  readOnly = false,
  language = "json",
  theme = "vs",
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor")
  ) => {
    editorRef.current = editor;

    // 配置 JSON 验证
    if (schema && language === "json") {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemaRequest: "warning",
        enableSchemaRequest: true,
        schemas: [
          {
            uri: "http://feature-list.local/schema.json",
            fileMatch: ["*"],
            schema: schema,
          },
        ],
      });
    }

    // 配置编辑器选项
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

    // 添加自动补全增强
    if (language === "json" && schema) {
      monaco.languages.registerCompletionItemProvider("json", {
        provideCompletionItems: (_model, position) => {
          const suggestions = [
            {
              label: "feature-definition",
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: "添加新功能定义",
              insertText: [
                '"${1:featureId}": {',
                '  "title": "${2:功能名称}",',
                '  "description": "${3:功能描述}",',
                '  "paramsSchema": {',
                '    "${4:paramName}": {',
                '      "type": "${5|string,number,integer,boolean,array,object|}",',
                '      "description": "${6:参数描述}",',
                '      "default": "${7:默认值}"',
                "    }",
                "  }",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
            },
            {
              label: "parameter-string",
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: "添加字符串类型参数",
              insertText: [
                '"${1:paramName}": {',
                '  "type": "string",',
                '  "description": "${2:参数描述}",',
                '  "default": "${3:默认值}",',
                '  "minLength": ${4:1},',
                '  "maxLength": ${5:100}',
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
            },
            {
              label: "parameter-number",
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: "添加数字类型参数",
              insertText: [
                '"${1:paramName}": {',
                '  "type": "${2|number,integer|}",',
                '  "description": "${3:参数描述}",',
                '  "default": ${4:0},',
                '  "minimum": ${5:0},',
                '  "maximum": ${6:100}',
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
            },
            {
              label: "parameter-boolean",
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: "添加布尔类型参数",
              insertText: [
                '"${1:paramName}": {',
                '  "type": "boolean",',
                '  "description": "${2:参数描述}",',
                '  "default": ${3|true,false|}',
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
            },
            {
              label: "parameter-array",
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: "添加数组类型参数",
              insertText: [
                '"${1:paramName}": {',
                '  "type": "array",',
                '  "description": "${2:参数描述}",',
                '  "items": {',
                '    "type": "${3|string,number,object|}"',
                "  },",
                '  "default": [],',
                '  "minItems": ${4:0},',
                '  "maxItems": ${5:10}',
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
            },
            {
              label: "feature-with-children",
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: "添加带子功能的功能定义",
              insertText: [
                '"${1:featureId}": {',
                '  "title": "${2:功能名称}",',
                '  "description": "${3:功能描述}",',
                '  "paramsSchema": {',
                '    "${4:paramName}": {',
                '      "type": "${5|string,number,integer,boolean,array,object|}",',
                '      "description": "${6:参数描述}",',
                '      "default": "${7:默认值}"',
                "    }",
                "  },",
                '  "${8:subFeatureId}": {',
                '    "title": "${9:子功能名称}",',
                '    "description": "${10:子功能描述}",',
                '    "paramsSchema": {',
                '      "${11:subParamName}": {',
                '        "type": "${12|string,number,boolean|}",',
                '        "description": "${13:子功能参数描述}",',
                '        "default": "${14:默认值}"',
                "      }",
                "    }",
                "  }",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
            },
            {
              label: "sub-feature",
              kind: monaco.languages.CompletionItemKind.Snippet,
              documentation: "添加子功能",
              insertText: [
                '"${1:subFeatureId}": {',
                '  "title": "${2:子功能名称}",',
                '  "description": "${3:子功能描述}",',
                '  "paramsSchema": {',
                '    "${4:paramName}": {',
                '      "type": "${5|string,number,boolean|}",',
                '      "description": "${6:参数描述}",',
                '      "default": "${7:默认值}"',
                "    }",
                "  }",
                "}",
              ].join("\n"),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: position.column,
                endColumn: position.column,
              },
            },
          ];
          return { suggestions };
        },
      });
    }

    // 延迟自动格式化
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
