#!/bin/bash

# X-Next Docker部署脚本
# 适用于Amazon Linux 2023系统

set -e

echo "🚀 开始部署 X-Next 应用..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，正在安装Docker..."
    
    # 更新系统
    sudo dnf update -y
    
    # 安装Docker
    sudo dnf install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # 将当前用户添加到docker组
    sudo usermod -aG docker $USER
    echo "✅ Docker安装完成"
else
    echo "✅ Docker已安装"
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，正在安装..."
    
    # 安装Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    echo "✅ Docker Compose安装完成"
else
    echo "✅ Docker Compose已安装"
fi

# 检查环境变量文件
if [ ! -f .env ]; then
    echo "❌ .env文件不存在，正在创建..."
    cp env.example .env
    echo "⚠️  请编辑 .env 文件配置您的环境变量"
    echo "⚠️  配置完成后重新运行此脚本"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down || true

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 运行数据库迁移
echo "🗄️  运行数据库迁移..."
docker-compose exec app npx prisma migrate deploy

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 显示访问信息
echo ""
echo "🎉 部署完成！"
echo "📱 应用访问地址: http://localhost:3334"
echo "🗄️  数据库访问: localhost:5432"
echo "🔴 Redis访问: localhost:6379"
echo ""
echo "📋 常用命令:"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo "  进入容器: docker-compose exec app sh"
