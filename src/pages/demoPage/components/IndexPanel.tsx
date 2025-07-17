import React from "react";
import { Tag, Descriptions } from "antd";
import { useFeatures, useFeaturesContext } from "../../../core";

const IndexPanel: React.FC = () => {
  const features = useFeatures();
  const { isPreimium, isEnterprise, isCommunity, currentVersion } =
    useFeaturesContext();

  // 判断演示数据
  // 读取功能配置项示例
  const configDemoList = [
    {
      label: "读取项目可创建配置",
      code: "features.projects.config.canCreate",
      explain: "读取项目功能的可创建配置项",
      value: features.projects?.config?.canCreate,
      color: features.projects?.config?.canCreate ? "green" : "red",
      text: features.projects?.config?.canCreate ? "可创建" : "不可创建",
    },
    {
      label: "读取代码 LFS 最大文件",
      code: "features.code.lfs.config.maxFileSize",
      explain: "读取代码功能的 LFS 最大文件大小配置",
      value: features.code?.lfs?.config?.maxFileSize,
      color: "purple",
      text: String(features.code?.lfs?.config?.maxFileSize) + " MB",
    },
    {
      label: "读取文档模式",
      code: "features.docs.config.mode",
      explain: "读取文档功能的编辑模式配置",
      value: features.docs?.config?.mode,
      color: "blue",
      text: features.docs?.config?.mode === "markdown" ? "Markdown" : "富文本",
    },
  ];

  const judgeList = [
    {
      label: "三元表达式判断",
      code: "features.code.enabled ? true : false",
      explain: "根据条件返回不同值",
      value: features.code.enabled ? true : false,
      color: features.code.enabled ? "green" : "red",
      text: features.code.enabled ? "启用" : "禁用",
    },
    {
      label: "布尔值判断",
      code: "features.docs.enabled",
      explain: "将值转为布尔类型",
      value: features.docs.enabled,
      color: features.docs.enabled ? "green" : "red",
      text: features.docs.enabled ? "启用" : "禁用",
    },
    {
      label: "isPreimium 判断",
      code: "isPreimium",
      explain: "判断是否高级版",
      value: isPreimium,
      color: isPreimium ? "gold" : "default",
      text: isPreimium ? "高级版" : "基础版",
    },
    {
      label: "isEnterprise 判断",
      code: "isEnterprise",
      explain: "判断是否企业版",
      value: isEnterprise,
      color: isEnterprise ? "blue" : "default",
      text: isEnterprise ? "企业版" : "否",
    },
    {
      label: "isCommunity 判断",
      code: "isCommunity",
      explain: "判断是否社区版",
      value: isCommunity,
      color: isCommunity ? "cyan" : "default",
      text: isCommunity ? "社区版" : "否",
    },
    {
      label: "currentVersion",
      code: "currentVersion",
      explain: "当前版本字符串",
      value: currentVersion,
      color: "purple",
      text: currentVersion,
    },
  ];

  return (
    <>
      <Descriptions column={1} size="small" bordered className="mb-8">
        {judgeList.map((item) => (
          <Descriptions.Item key={item.label} label={item.label}>
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: "#888", fontSize: 12 }}>
                {item.explain}
              </span>
            </div>
            <pre className="bg-zinc-900 text-zinc-100 px-4 py-2 rounded-md text-sm mb-2 font-mono shadow border border-zinc-800 overflow-x-auto tracking-wide">
              {item.code}
            </pre>
            <Tag color={item.color}>{item.text}</Tag>
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Descriptions column={1} size="small" bordered title="功能配置项读取示例">
        {configDemoList.map((item) => (
          <Descriptions.Item key={item.label} label={item.label}>
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: "#888", fontSize: 12 }}>
                {item.explain}
              </span>
            </div>
            <pre className="bg-zinc-900 text-zinc-100 px-4 py-2 rounded-md text-sm mb-2 font-mono shadow border border-zinc-800 overflow-x-auto tracking-wide">
              {item.code}
            </pre>
            <Tag color={item.color}>{item.text}</Tag>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  );
};

export default IndexPanel;
