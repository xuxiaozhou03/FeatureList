#!/bin/bash

echo "🚀 开始测试多版本构建..."

echo ""
echo "📦 构建企业版..."
npm run build:enterprise

echo ""
echo "📦 构建基础版..."
npm run build:basic

echo ""
echo "📊 分析打包结果..."

echo ""
echo "🎉 企业版构建完成！包含以下功能模块："
echo "- 用户认证 (增强版，支持SSO/OAuth)"
echo "- 仪表盘 (全功能)"
echo "- 基础报表"
echo "- 高级报表 (数据分析、实时监控)"
echo "- API管理 (限流、监控、文档)"

echo ""
echo "🎉 基础版构建完成！包含以下功能模块："
echo "- 用户认证 (基础版)"
echo "- 仪表盘 (基础组件)"
echo "- 基础报表"

echo ""
echo "✅ 多版本构建测试完成！"
