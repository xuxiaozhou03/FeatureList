#!/bin/zsh




# 构建项目，生成 dist 目录
pnpm build

# 检查 dist 目录是否存在
if [ ! -d "dist" ]; then
  echo "dist 目录不存在，构建失败"
  exit 1
fi

# 提交 dist 目录（不会切换分支）
git add dist
git commit -m "build: update dist" || echo "No changes to commit"

# 强制推送 dist 到 docs 分支（不切分支，解决非 fast-forward 问题）
git push origin `git subtree split --prefix dist main`:docs --force
