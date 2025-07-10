import React from "react";
import { Alert } from "antd";
import styles from "../index.module.css";

const HelpTab: React.FC = () => {
  return (
    <div className={styles.helpContainer}>
      <Alert
        type="info"
        message="功能定义说明"
        description={
          <div>
            <p>
              功能定义用于描述功能的结构和参数约束，支持嵌套结构。树形预览会将每个功能的参数部分单独展示为
              <strong>属性参数</strong>节点，便于直观查看每层功能的参数配置。
            </p>
            <pre
              style={{
                fontSize: "12px",
                background: "#f5f5f5",
                padding: "12px",
                borderRadius: "4px",
                marginTop: "12px",
              }}
            >
              {`{
  "功能ID": {
    "title": "功能显示名称",
    "description": "功能描述（可选）", 
    "paramsSchema": {
      "参数名": {
        "type": "string|number|integer|boolean",
        "description": "参数描述",
        "default": "默认值",
        "minimum": 最小值,
        "maximum": 最大值,
        "enum": ["枚举值1", "枚举值2"]
      }
    },
    "子功能ID": {
      "title": "子功能名称",
      "description": "子功能描述（可选）",
      "paramsSchema": {
        // 子功能的参数定义
      },
      "子子功能ID": {
        // 可以继续嵌套子功能
      }
    }
  }
}`}
            </pre>

            <h4 style={{ marginTop: "16px" }}>树形预览说明：</h4>
            <ul>
              <li>
                每个功能节点会显示其 <strong>title</strong>（显示名称）、
                <strong>description</strong>（描述）和功能 ID。
              </li>
              <li>
                每个 <code>paramsSchema</code> 会在树中以{" "}
                <strong>属性参数</strong> 节点单独展示，便于区分参数和子功能。
              </li>
              <li>参数节点会显示类型、描述、默认值、取值范围等详细信息。</li>
              <li>支持多层嵌套，所有子功能和参数都能清晰分层展示。</li>
            </ul>

            <h4 style={{ marginTop: "16px" }}>参数类型说明：</h4>
            <ul>
              <li>
                <code>string</code> - 字符串类型，支持 minLength, maxLength,
                pattern
              </li>
              <li>
                <code>number</code> - 数字类型，支持 minimum, maximum
              </li>
              <li>
                <code>integer</code> - 整数类型，支持 minimum, maximum
              </li>
              <li>
                <code>boolean</code> - 布尔类型
              </li>
            </ul>

            <h4 style={{ marginTop: "16px" }}>嵌套功能：</h4>
            <p>
              子功能直接定义在父功能中，除了 title、description、paramsSchema
              之外的属性都被视为子功能。每个子功能都有自己的
              title、description（可选）、paramsSchema（可选）和更深层的子功能。paramsSchema
              仅用于定义参数，不包含子功能，在树形预览中会以“属性参数”节点展示。
            </p>
          </div>
        }
        style={{ marginBottom: 16 }}
        showIcon
      />
    </div>
  );
};

export default HelpTab;
