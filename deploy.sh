#!/bin/bash
# 传统⽂化前端部署脚本 - 在 Linux VM 上执行
# 使用方法:
#   1. 在开发机打包: npm run build
#   2. 传到 VM:    scp -r dist/* user@vm-ip:/tmp/tc-dist/
#   3. 在 VM 执行: bash deploy.sh

set -e

SITE_DIR="/var/www/traditional-culture"
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"

echo "=== 部署传统文化前端 ==="

# 1. 安装 nginx（如果没装）
if ! command -v nginx &>/dev/null; then
  echo "安装 Nginx..."
  sudo apt update && sudo apt install -y nginx
fi

# 2. 创建站点目录
sudo mkdir -p "$SITE_DIR"

# 3. 复制构建产物
if [ -d /tmp/tc-dist ]; then
  sudo cp -r /tmp/tc-dist/* "$SITE_DIR/"
  echo "✅ 文件已复制到 $SITE_DIR"
else
  echo "⚠️  未找到 /tmp/tc-dist，请先上传构建产物"
  exit 1
fi

# 4. 写入 Nginx 配置
NGINX_CONF="/etc/nginx/sites-available/traditional-culture"

sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root $SITE_DIR;
    index index.html;

    client_max_body_size 12m;

    location /api/ {
        proxy_pass $BACKEND_URL;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /uploads/ {
        proxy_pass $BACKEND_URL;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# 5. 启用站点
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/

# 6. 测试并重载
sudo nginx -t && sudo systemctl reload nginx

echo "✅ 部署完成，访问 http://$(hostname -I | awk '{print $1}')"
