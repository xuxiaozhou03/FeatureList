export function schemaToTypescript(
  schema: Record<string, unknown>,
  rootName = "IVersion"
): string {
  function parseProperties(
    properties: Record<string, unknown>,
    indent = "  "
  ): string {
    return Object.entries(properties)
      .map(([key, value]) => {
        if (typeof value !== "object" || value === null)
          return `${indent}${key}: any;`;
        let typeStr = "any";
        const v = value as Record<string, unknown>;
        let comment = "";
        if (typeof v.description === "string" && v.description) {
          comment = `${indent}/** ${v.description} */\n`;
        }
        if (v.type === "string") typeStr = "string";
        else if (v.type === "number") typeStr = "number";
        else if (v.type === "boolean") typeStr = "boolean";
        else if (v.type === "object" && v.properties) {
          typeStr = `{
${parseProperties(v.properties as Record<string, unknown>, indent + "  ")}
${indent}}`;
        } else if (v.type === "array" && v.items) {
          typeStr = `${parseType(v.items, indent)}[]`;
        }
        return `${comment}${indent}${key}: ${typeStr};`;
      })
      .join("\n");
  }
  function parseType(value: unknown, indent = "  "): string {
    if (typeof value !== "object" || value === null) return "any";
    const v = value as Record<string, unknown>;
    if (v.type === "string") return "string";
    if (v.type === "number") return "number";
    if (v.type === "boolean") return "boolean";
    if (v.type === "object" && v.properties) {
      return `{
${parseProperties(v.properties as Record<string, unknown>, indent + "  ")}
${indent}}`;
    }
    if (v.type === "array" && v.items) {
      return `${parseType(v.items, indent)}[]`;
    }
    return "any";
  }
  if (!schema || typeof schema !== "object" || !("properties" in schema))
    return "// 无法生成类型定义";
  return `export interface ${rootName} {
${parseProperties(schema.properties as Record<string, unknown>)}
}`;
}
