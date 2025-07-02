// 读取 packages/define/src/types.ts

// 读取 VersionConfig 定义
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const typesPath = path.resolve(__dirname, "../../define/src/types.ts");

const typesContent = fs.readFileSync(typesPath, "utf-8");

function parseTypes(content) {
  const sourceFile = ts.createSourceFile(
    "types.ts",
    content,
    ts.ScriptTarget.ES2015,
    true
  );

  const result = [];

  function parseObjectType(typeNode) {
    const properties = [];
    if (ts.isTypeLiteralNode(typeNode)) {
      typeNode.members.forEach((member) => {
        if (ts.isPropertySignature(member)) {
          const name = member.name.getText(sourceFile);
          const type = member.type;
          const isOptional = member.questionToken !== undefined; // 检测可选属性

          const property = {
            name,
            type: type ? type.getText(sourceFile) : "any",
            optional: isOptional, // 添加可选属性标记
          };

          // 获取前置注释
          const leadingComments = ts.getLeadingCommentRanges(
            sourceFile.text,
            member.pos
          );
          if (leadingComments && leadingComments.length > 0) {
            const comment = leadingComments[leadingComments.length - 1];
            const commentText = sourceFile.text.substring(
              comment.pos,
              comment.end
            );

            let commentContent = null;
            // 处理单行注释 //
            const singleLineMatch = commentText.match(/\/\/\s*(.+)/);
            if (singleLineMatch) {
              commentContent = singleLineMatch[1].trim();
            } else {
              // 处理块注释 /* */
              const blockCommentMatch =
                commentText.match(/\/\*\s*(.*?)\s*\*\//s);
              if (blockCommentMatch) {
                commentContent = blockCommentMatch[1].trim();
              }
            }

            if (commentContent) {
              property.comment = commentContent;
            }
          }

          if (type && ts.isTypeLiteralNode(type)) {
            property.properties = parseObjectType(type);
          }

          properties.push(property);
        }
      });
    }
    return properties;
  }

  function visit(node) {
    if (ts.isInterfaceDeclaration(node) && node.name.text === "VersionConfig") {
      node.members.forEach((member) => {
        if (ts.isPropertySignature(member)) {
          const name = member.name.getText(sourceFile);
          const type = member.type;
          const isOptional = member.questionToken !== undefined; // 检测可选属性
          let label = name.charAt(0).toUpperCase() + name.slice(1);
          let comment = null;

          // 获取前置注释
          const leadingComments = ts.getLeadingCommentRanges(
            sourceFile.text,
            member.pos
          );
          if (leadingComments && leadingComments.length > 0) {
            const commentNode = leadingComments[leadingComments.length - 1];
            const commentText = sourceFile.text.substring(
              commentNode.pos,
              commentNode.end
            );

            let commentContent = null;
            // 处理 JSDoc 注释 /** */
            const jsdocMatch = commentText.match(/\/\*\*\s*(.*?)\s*\*\//s);
            if (jsdocMatch) {
              commentContent = jsdocMatch[1].trim();
            } else {
              // 处理单行注释 //
              const singleLineMatch = commentText.match(/\/\/\s*(.+)/);
              if (singleLineMatch) {
                commentContent = singleLineMatch[1].trim();
              } else {
                // 处理块注释 /* */
                const blockCommentMatch =
                  commentText.match(/\/\*\s*(.*?)\s*\*\//s);
                if (blockCommentMatch) {
                  commentContent = blockCommentMatch[1].trim();
                }
              }
            }

            if (commentContent) {
              label = commentContent;
              comment = commentContent;
            }
          }

          const property = { label, name, optional: isOptional };
          if (comment) {
            property.comment = comment;
          }

          if (type) {
            if (ts.isTypeLiteralNode(type)) {
              property.properties = parseObjectType(type);
            } else {
              property.type = type.getText(sourceFile);
            }
          }

          result.push(property);
        }
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return result;
}

function generateJsonStructure(types) {
  return types.map((type) => {
    const { label, name, type: fieldType, properties, optional } = type;
    const item = {
      label,
      name,
      required: !optional, // 根据可选属性决定是否必填
    };

    if (name === "features" && properties) {
      // 处理 features 字段的特殊结构
      item.children = properties.map((feature) => {
        const featureItem = {
          label: getFeatureLabel(feature), // 使用注释作为 label
          name: feature.name,
          params: [],
          required: !feature.optional,
        };

        // 解析 params
        if (feature.properties) {
          const paramsProperty = feature.properties.find(
            (prop) => prop.name === "params"
          );
          if (paramsProperty && paramsProperty.properties) {
            featureItem.params = paramsProperty.properties.map((param) => ({
              label: param.comment || param.name, // 优先使用注释
              name: param.name,
              type: param.type,
              required: !param.optional, // 根据可选属性决定是否必填
            }));
          }

          // 解析 children
          const childrenProperty = feature.properties.find(
            (prop) => prop.name === "children"
          );
          if (childrenProperty && childrenProperty.properties) {
            featureItem.children = parseChildren(childrenProperty.properties);
          }
        }

        return featureItem;
      });
    } else if (fieldType === "string" || fieldType === "number") {
      item.type = fieldType;
    } else if (properties) {
      item.children = [];
    } else {
      item.params = [];
    }

    return item;
  });
}

// 递归解析 children
function parseChildren(children) {
  return children.map((child) => {
    const childItem = {
      label: getFeatureLabel(child), // 使用注释作为 label
      name: child.name,
      params: [],
      required: !child.optional,
    };

    if (child.properties) {
      // 解析 params
      const childParamsProperty = child.properties.find(
        (prop) => prop.name === "params"
      );
      if (childParamsProperty && childParamsProperty.properties) {
        childItem.params = childParamsProperty.properties.map((param) => ({
          label: param.comment || param.name, // 优先使用注释
          name: param.name,
          type: param.type,
          required: !param.optional,
        }));
      }

      // 递归解析嵌套的 children
      const nestedChildrenProperty = child.properties.find(
        (prop) => prop.name === "children"
      );
      if (nestedChildrenProperty && nestedChildrenProperty.properties) {
        childItem.children = parseChildren(nestedChildrenProperty.properties);
      }
    }

    return childItem;
  });
}

// 获取功能的 label，只使用注释
function getFeatureLabel(feature) {
  return feature.comment || feature.name; // 优先使用注释，fallback 到 name
}

function main() {
  const types = parseTypes(typesContent);
  const jsonStructure = generateJsonStructure(types);

  // 输出到 packages/define/src/config.json
  const outputPath = path.resolve(__dirname, "../src/config.json");
  const jsonContent = JSON.stringify(jsonStructure, null, 2);

  fs.writeFileSync(outputPath, jsonContent, "utf-8");
  console.log(`配置文件已生成: ${outputPath}`);
}
main();
