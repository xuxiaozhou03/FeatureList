import ts from "typescript";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsFile = path.join(__dirname, "../src/core/feature.d.ts");
const outputFile = path.join(__dirname, "../public/feature.schema.json");

const source = fs.readFileSync(tsFile, "utf-8");
const sourceFile = ts.createSourceFile(
  tsFile,
  source,
  ts.ScriptTarget.Latest,
  true
);

function getJSDocTags(node) {
  const tags = {};
  if (!node.jsDoc || !node.jsDoc.length) return tags;
  const jsDoc = node.jsDoc[node.jsDoc.length - 1];
  if (jsDoc.tags) {
    jsDoc.tags.forEach((tag) => {
      const tagName = tag.tagName.escapedText;
      if (!tags[tagName]) tags[tagName] = [];
      tags[tagName].push(tag.comment);
    });
  }
  // 处理 title/description: 第一行为title，后续为description
  if (jsDoc.comment) {
    const lines = jsDoc.comment.split(/\r?\n/);
    if (lines.length > 0) {
      tags.title = lines[0];
      if (lines.length > 1) {
        tags.description = lines.slice(1).join("\n").trim();
      }
    }
  }
  return tags;
}

function parseEnumAndDescriptions(tags) {
  let result = {};
  if (
    tags.enum &&
    tags.enum.length &&
    typeof tags.enum[0] === "string" &&
    tags.enum[0].trim()
  ) {
    try {
      result.enum = JSON.parse(tags.enum[0]);
    } catch {
      result.enum = tags.enum[0]
        ? tags.enum[0]
            .replace(/[[\]"]/g, "")
            .split(",")
            .map((s) => s.trim())
        : [];
    }
  }
  if (tags.enumDescription && tags.enumDescription.length) {
    // 支持多行 @enumDescription
    result.enumDescriptions = tags.enumDescription.map((desc) => {
      if (!desc) return desc;
      // 兼容 "xxx" - yyy 格式
      const m = desc.match(/"([^\"]+)"\s*-\s*(.+)/);
      return m ? m[2].trim() : desc;
    });
  }
  return result;
}

function parseType(typeNode) {
  if (!typeNode) return {};
  if (ts.isTypeReferenceNode(typeNode)) {
    if (typeNode.typeName.escapedText === "Array" && typeNode.typeArguments) {
      return { type: "array", items: parseType(typeNode.typeArguments[0]) };
    }
    return { type: "object" };
  }
  if (ts.isUnionTypeNode(typeNode)) {
    const enums = typeNode.types
      .filter((t) => ts.isLiteralTypeNode(t))
      .map((t) => t.literal.text);
    if (enums.length === typeNode.types.length) {
      return { type: typeof enums[0], enum: enums };
    }
    return { anyOf: typeNode.types.map(parseType) };
  }
  if (ts.isLiteralTypeNode(typeNode)) {
    return {
      type: typeof typeNode.literal.text,
      enum: [typeNode.literal.text],
    };
  }
  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword:
      return { type: "string" };
    case ts.SyntaxKind.NumberKeyword:
      return { type: "number" };
    case ts.SyntaxKind.BooleanKeyword:
      return { type: "boolean" };
    case ts.SyntaxKind.AnyKeyword:
      return {};
    default:
      return {};
  }
}

function parseInterface(node) {
  const schema = { type: "object", properties: {}, required: [] };
  node.members.forEach((member) => {
    if (!member.name) return;
    const name = member.name.escapedText;
    const tags = getJSDocTags(member);
    let prop = {};
    if (member.type && member.type.kind === ts.SyntaxKind.TypeLiteral) {
      prop = parseInterface(member.type);
    } else {
      prop = parseType(member.type);
    }
    // 合并 JSDoc
    if (tags.title) prop.title = tags.title;
    if (tags.description)
      prop.description = Array.isArray(tags.description)
        ? tags.description[0]
        : tags.description;
    if (tags.default) {
      try {
        prop.default = JSON.parse(tags.default[0]);
      } catch {
        prop.default = tags.default[0];
      }
    }
    if (tags.min) prop.minimum = Number(tags.min[0]);
    if (tags.max) prop.maximum = Number(tags.max[0]);
    Object.assign(prop, parseEnumAndDescriptions(tags));
    schema.properties[name] = prop;
    // 仅当属性非可选时加入 required
    if (!member.questionToken) {
      schema.required.push(name);
    }
  });
  return schema;
}

let mainSchema = null;
ts.forEachChild(sourceFile, (node) => {
  if (ts.isInterfaceDeclaration(node) && node.name.escapedText === "IFeature") {
    mainSchema = parseInterface(node);
  }
});

if (mainSchema) {
  mainSchema.title = "IFeature";
  // 添加 $schema 字段
  const schemaWithMeta = {
    $schema: "http://json-schema.org/draft-07/schema#",
    ...mainSchema,
  };
  fs.writeFileSync(outputFile, JSON.stringify(schemaWithMeta, null, 2));
  console.log("feature.schema.json generated!");
} else {
  console.error("IFeature interface not found!");
}
