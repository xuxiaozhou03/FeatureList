/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input, Switch, Form, Select } from "antd";
import type { ISchema, IFeatureSchema } from "./useFeatureSchema";

interface FeatureFormProps {
  schema: ISchema;
  value: any;
  onChange: (val: any) => void;
}

const borderColors = [
  "border-blue-600 bg-blue-50",
  "border-green-600 bg-green-50",
  "border-purple-600 bg-purple-50",
  "border-orange-600 bg-orange-50",
  "border-pink-600 bg-pink-50",
  "border-gray-600 bg-gray-50",
];

function renderField(
  key: string,
  prop: IFeatureSchema,
  value: any,
  onChange: (val: any) => void,
  depth = 0
) {
  // enabled 只在卡片右侧渲染，不单独渲染
  if (key === "enabled") {
    return null;
  }
  if (prop.type === "string" && Array.isArray((prop as any).enum)) {
    // 字符串类型且有 enum，使用 Select
    const { enumDescriptions } = prop as any;
    console.log(enumDescriptions);
    const options = (prop as any).enum.map((item: any, i: number) => ({
      value: item,
      label: enumDescriptions ? enumDescriptions[i] : String(item),
    }));
    return (
      <Form.Item label={prop.title || key} key={key}>
        <Select
          value={value}
          onChange={(val) => onChange({ ...value, [key]: val })}
          options={options}
          allowClear
        />
      </Form.Item>
    );
  }
  if (prop.type === "string") {
    return (
      <Form.Item label={prop.title || key} key={key}>
        <Input
          value={value}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        />
      </Form.Item>
    );
  }
  if (prop.type === "boolean") {
    return (
      <Form.Item label={prop.title || key} key={key} valuePropName="checked">
        <Switch
          checked={!!value}
          onChange={(checked) => onChange({ ...value, [key]: checked })}
        />
      </Form.Item>
    );
  }
  if (prop.type === "number") {
    return (
      <Form.Item label={prop.title || key} key={key}>
        <Input
          type="number"
          value={value}
          onChange={(e) =>
            onChange({ ...value, [key]: Number(e.target.value) })
          }
        />
      </Form.Item>
    );
  }
  if (prop.type === "object" && prop.properties) {
    if (prop.type === "object" && prop.properties) {
      // 功能卡片布局
      const colorClass = borderColors[depth % borderColors.length];
      const enabledProp = prop.properties && (prop.properties as any).enabled;
      const configProp = prop.properties && (prop.properties as any).config;
      const enabledValue = value?.enabled;
      // 除去 enabled 和 config 的子功能
      const subFeatureKeys = Object.keys(prop.properties).filter(
        (k) => k !== "enabled" && k !== "config"
      );
      return (
        <div
          key={key}
          className={`ml-[${
            (depth + 1) * 16
          }px] border-l-8 ${colorClass} rounded shadow-sm`}
          style={{
            boxShadow: `0 2px 8px 0 rgba(0,0,0,${0.04 + depth * 0.03})`,
          }}
        >
          <div
            className="px-4 py-2 font-semibold text-blue-700 flex items-center justify-between bg-opacity-80"
            style={{
              background: depth > 0 ? "rgba(59,130,246,0.08)" : undefined,
            }}
          >
            <span>{prop.title ? `${prop.title} (${key})` : key}</span>
            {enabledProp && (
              <span className="flex items-center gap-2">
                <Switch
                  checked={!!enabledValue}
                  onChange={(checked) =>
                    onChange({ ...value, enabled: checked })
                  }
                  size="small"
                />
                <span className="text-xs text-gray-500 select-none">
                  {enabledValue ? "开启" : "关闭"}
                </span>
              </span>
            )}
          </div>
          {/* config 独立卡片，显示为“属性配置” */}
          {configProp && (
            <div className={`ml-[${(depth + 2) * 16}px]`}>
              {/* 属性配置卡片内容左右结构 */}
              <div className="bg-white rounded border border-blue-100 p-4">
                <div className="text-sm font-bold text-blue-700 mb-2">
                  属性配置
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                  {Object.entries((configProp as any).properties || {}).map(
                    ([cfgKey, cfgProp]: [string, any]) => {
                      if (Array.isArray(cfgProp.enum)) {
                        const options = cfgProp.enum.map((item: any) => ({
                          value: item,
                          label: cfgProp.enumDescriptions
                            ? cfgProp.enumDescriptions[
                                cfgProp.enum.indexOf(item)
                              ] + ` (${item})`
                            : String(item),
                        }));
                        return (
                          <div key={cfgKey} className="flex items-center">
                            <div className="w-32 text-gray-600 text-xs mr-2">
                              {cfgProp.title || cfgKey}
                            </div>
                            <Select
                              value={value?.config?.[cfgKey]}
                              onChange={(val) =>
                                onChange({
                                  ...value,
                                  config: { ...value.config, [cfgKey]: val },
                                })
                              }
                              options={options}
                              allowClear
                              className="flex-1"
                            />
                          </div>
                        );
                      }
                      if (cfgProp.type === "string") {
                        return (
                          <div key={cfgKey} className="flex items-center">
                            <div className="w-32 text-gray-600 text-xs mr-2">
                              {cfgProp.title || cfgKey}
                            </div>
                            <Input
                              value={value?.config?.[cfgKey]}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  config: {
                                    ...value.config,
                                    [cfgKey]: e.target.value,
                                  },
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        );
                      }
                      if (cfgProp.type === "number") {
                        return (
                          <div key={cfgKey} className="flex items-center">
                            <div className="w-32 text-gray-600 text-xs mr-2">
                              {cfgProp.title || cfgKey}
                            </div>
                            <Input
                              type="number"
                              value={value?.config?.[cfgKey]}
                              onChange={(e) =>
                                onChange({
                                  ...value,
                                  config: {
                                    ...value.config,
                                    [cfgKey]: Number(e.target.value),
                                  },
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        );
                      }
                      if (cfgProp.type === "boolean") {
                        return (
                          <div key={cfgKey} className="flex items-center">
                            <div className="w-32 text-gray-600 text-xs mr-2">
                              {cfgProp.title || cfgKey}
                            </div>
                            <Switch
                              checked={!!value?.config?.[cfgKey]}
                              onChange={(checked) =>
                                onChange({
                                  ...value,
                                  config: {
                                    ...value.config,
                                    [cfgKey]: checked,
                                  },
                                })
                              }
                              size="small"
                            />
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </div>
            </div>
          )}
          {/* 子功能卡片递归，仅功能卡片显示分组标题 */}
          {subFeatureKeys.length > 0 && key !== "属性配置" && (
            <div className="flex flex-col gap-2 p-4">
              <div className="text-xs text-gray-400 mb-1 pl-1">子功能</div>
              {subFeatureKeys.map((subKey) =>
                renderField(
                  subKey,
                  (prop.properties as any)[subKey],
                  value?.[subKey],
                  (v) => onChange({ ...value, [subKey]: v[subKey] ?? v }),
                  depth + 1
                )
              )}
            </div>
          )}
          {subFeatureKeys.length > 0 && key === "属性配置" && (
            <div className="flex flex-col gap-2 p-4">
              {subFeatureKeys.map((subKey) =>
                renderField(
                  subKey,
                  (prop.properties as any)[subKey],
                  value?.[subKey],
                  (v) => onChange({ ...value, [subKey]: v[subKey] ?? v }),
                  depth + 1
                )
              )}
            </div>
          )}
        </div>
      );
    }
  }
  return null;
}

const FeatureForm: React.FC<FeatureFormProps & { depth?: number }> = ({
  schema,
  value,
  onChange,
  depth = 0,
}) => {
  if (depth === 0) {
    return (
      <Form layout="vertical" className="flex flex-col gap-2">
        {Object.entries(schema.properties).map(([key, prop]) =>
          renderField(
            key,
            prop,
            value?.[key],
            (v) => onChange({ ...value, [key]: v[key] ?? v }),
            depth
          )
        )}
      </Form>
    );
  }
  // 嵌套层只用 div 包裹
  return (
    <div>
      {Object.entries(schema.properties).map(([key, prop]) =>
        renderField(
          key,
          prop,
          value?.[key],
          (v) => onChange({ ...value, [key]: v[key] ?? v }),
          depth
        )
      )}
    </div>
  );
};

export default FeatureForm;
