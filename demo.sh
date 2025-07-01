#!/bin/bash

# 功能演示脚本
echo "🚀 FeatureList 项目演示脚本"
echo "============================="

# 检查依赖
echo "📦 检查项目依赖..."
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm"
    exit 1
fi

# 安装依赖
echo "📥 安装项目依赖..."
pnpm install

echo ""
echo "📁 项目结构："
tree -I 'node_modules|dist|.git' -a

echo ""
echo "📋 版本功能对比："
echo "┌─────────────────────────┬─────────┬─────────┬─────────────┐"
echo "│ 功能                    │ 基础版  │ 专业版  │ 企业版      │"
echo "├─────────────────────────┼─────────┼─────────┼─────────────┤"
echo "│ 用户管理                │   ✓     │   ✓     │     ✓       │"
echo "│ 基础仪表板              │   ✓     │   ✓     │     ✓       │"
echo "│ 文件上传                │   ✓     │   ✓     │     ✓       │"
echo "│ 高级仪表板              │   ✗     │   ✓     │     ✓       │"
echo "│ 批量操作                │   ✗     │   ✓     │     ✓       │"
echo "│ 数据导出                │   ✗     │   ✓     │     ✓       │"
echo "│ API 集成                │   ✗     │   ✗     │     ✓       │"
echo "│ 高级权限管理            │   ✗     │   ✗     │     ✓       │"
echo "│ 审计日志                │   ✗     │   ✗     │     ✓       │"
echo "│ 自定义报告              │   ✗     │   ✗     │     ✓       │"
echo "│ 企业级安全              │   ✗     │   ✗     │     ✓       │"
echo "└─────────────────────────┴─────────┴─────────┴─────────────┘"

echo ""
echo "🌐 启动应用演示..."
echo ""
echo "📊 主应用访问地址："
echo "   - 基础版本: http://localhost:3000?version=basic"
echo "   - 专业版本: http://localhost:3000?version=pro" 
echo "   - 企业版本: http://localhost:3000?version=enterprise"
echo ""
echo "⚙️ 配置管理器: http://localhost:3001"
echo ""
echo "💡 功能说明："
echo "   - 主应用支持通过 URL 参数切换版本"
echo "   - 配置管理器可以在线编辑和预览配置"
echo "   - 所有功能基于 JSON 配置动态加载"
echo ""
echo "正在启动应用... 请稍等"

# 启动应用
echo "🏁 启动主应用..."
cd packages/app && pnpm dev &
APP_PID=$!

echo "⚙️ 启动配置管理器..."
cd ../config-manager && pnpm dev &
CONFIG_PID=$!

echo ""
echo "✅ 应用启动完成！"
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait $APP_PID $CONFIG_PID
echo "│ 高级分析                │   ✗     │   ✗     │     ✓       │"
echo "│ API集成                 │   ✗     │   ✗     │     ✓       │"
echo "│ 角色权限                │   ✗     │   ✗     │     ✓       │"
echo "│ 审计日志                │   ✗     │   ✗     │     ✓       │"
echo "└─────────────────────────┴─────────┴─────────┴─────────────┘"

echo ""
echo "🔧 开发命令："
echo "pnpm dev:basic      - 启动基础版本 (端口: 3001)"
echo "pnpm dev:pro        - 启动专业版本 (端口: 3002)" 
echo "pnpm dev:enterprise - 启动企业版本 (端口: 3003)"
echo "pnpm build:all      - 构建所有版本"

echo ""
echo "✨ 特性说明："
echo "• 基于 Monorepo 架构，统一管理多个版本"
echo "• 使用功能开关控制不同版本的功能显示"
echo "• 支持独立部署和版本管理"
echo "• 代码复用，降低维护成本"

echo ""
echo "📝 下一步："
echo "1. 运行 'pnpm install' 安装依赖"
echo "2. 选择版本运行开发服务器"
echo "3. 在浏览器中查看不同版本的功能差异"
