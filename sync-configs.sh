#!/bin/bash

# 配置文件同步脚本
echo "🔄 同步配置文件到前端项目..."

# 同步到 app 项目
echo "📊 同步到主应用..."
cp -r configs/*.json packages/app/public/configs/

# 同步到 config-manager 项目
echo "⚙️ 同步到配置管理器..."
cp -r configs/*.json packages/config-manager/public/configs/

echo "✅ 配置文件同步完成！"
echo ""
echo "📁 已同步的文件："
ls -la configs/
echo ""
echo "📊 主应用配置："
ls -la packages/app/public/configs/
echo ""
echo "⚙️ 配置管理器配置："
ls -la packages/config-manager/public/configs/
