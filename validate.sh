#!/bin/bash

# 项目验证脚本
echo "🧪 项目功能验证"
echo "================"

# 检查基础文件
echo "📁 检查项目结构..."
echo "✓ 检查配置文件..."
if [ -f "configs/basic.json" ] && [ -f "configs/pro.json" ] && [ -f "configs/enterprise.json" ]; then
    echo "  ✅ 版本配置文件存在"
else
    echo "  ❌ 版本配置文件缺失"
    exit 1
fi

echo "✓ 检查应用目录..."
if [ -d "packages/app" ] && [ -d "packages/config-manager" ]; then
    echo "  ✅ 应用目录存在"
else  
    echo "  ❌ 应用目录缺失"
    exit 1
fi

echo "✓ 检查配置同步..."
if [ -f "packages/app/public/configs/basic.json" ] && [ -f "packages/config-manager/public/configs/basic.json" ]; then
    echo "  ✅ 配置文件已同步"
else
    echo "  ⚠️ 配置文件未同步，运行同步脚本..."
    ./sync-configs.sh
fi

# 检查依赖
echo ""
echo "📦 检查依赖..."
if command -v pnpm &> /dev/null; then
    echo "  ✅ pnpm 已安装"
else
    echo "  ❌ pnpm 未安装"
    exit 1
fi

if [ -d "node_modules" ]; then
    echo "  ✅ 依赖已安装"
else
    echo "  ⚠️ 依赖未安装，正在安装..."
    pnpm install
fi

# 检查脚本
echo ""
echo "🔧 检查脚本..."
if [ -x "demo.sh" ] && [ -x "sync-configs.sh" ]; then
    echo "  ✅ 脚本可执行"
else
    echo "  ⚠️ 脚本权限修复..."
    chmod +x demo.sh sync-configs.sh
fi

echo ""
echo "✅ 项目验证完成！"
echo ""
echo "🚀 可用命令："
echo "  pnpm demo          # 启动完整演示"
echo "  pnpm dev:app       # 仅启动主应用"
echo "  pnpm dev:config    # 仅启动配置管理器"
echo "  pnpm start:all     # 同时启动两个应用"
echo "  pnpm sync:configs  # 同步配置文件"
echo ""
echo "🌐 访问地址："
echo "  主应用: http://localhost:3000"
echo "  配置管理器: http://localhost:3001"
