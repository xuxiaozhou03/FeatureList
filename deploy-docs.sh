#!/bin/zsh


# 构建项目，生成 dist 目录
pnpm build

# 检查 dist 目录是否存在
if [ ! -d "dist" ]; then
  echo "dist 目录不存在，构建失败"
  exit 1
fi

# 提交当前更改，避免切换分支报错
git add deploy-docs.sh
git commit -m "chore: update deploy script" || echo "No changes to commit"

# 切换到 docs 分支
git checkout docs

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
