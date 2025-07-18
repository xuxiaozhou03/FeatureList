#!/bin/zsh

# 构建项目，生成 dist 目录
pnpm build

# 切换到 docs 分支（如果没有则创建）
git checkout docs || git checkout -b docs

# 清空分支内容（保留 .git 文件夹）
git rm -rf ./*

# 复制 dist 内容到根目录
cp -r dist/* ./

# 添加所有文件
git add .

# 提交更改
git commit -m "deploy: update docs branch with dist" || echo "No changes to commit"

# 推送到远程 docs 分支
git push origin docs

# 切回主分支
git checkout main
