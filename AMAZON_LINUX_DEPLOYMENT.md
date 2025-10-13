# Amazon Linux 2023 部署指南

## 系统要求

- Amazon Linux 2023
- 至少 2GB RAM（推荐 4GB）
- 至少 20GB 可用磁盘空间
- EC2实例或本地Amazon Linux 2023系统

## 快速部署命令

### 1. 登录服务器

```bash
# 使用SSH登录到Amazon Linux 2023实例
ssh -i your-key.pem ec2-user@your-instance-ip

# 或者使用root用户
ssh -i your-key.pem root@your-instance-ip
```

### 2. 上传项目文件

```bash
# 方法1: 使用scp上传
scp -i your-key.pem -r /path/to/x-next ec2-user@your-instance-ip:/home/ec2-user/

# 方法2: 使用git克隆
cd /home/ec2-user
git clone <your-repo-url> x-next
cd x-next
```

### 3. 给脚本添加执行权限

```bash
chmod +x deploy.sh
```

### 4. 配置环境变量

```bash
# 复制环境变量示例文件
cp env.example .env

# 编辑环境变量
vim .env
```

配置内容：
```bash
# 数据库配置
POSTGRES_DB=xnext
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here

# Redis配置
REDIS_PASSWORD=your_redis_password_here

# 邮件服务配置
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password_here
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
```

### 5. 运行部署脚本

```bash
# 运行一键部署
./deploy.sh
```

### 6. 配置安全组（EC2）

在AWS控制台中为您的EC2实例配置安全组，开放以下端口：
- 端口 3334 (HTTP) - 应用访问
- 端口 22 (SSH) - 管理访问

### 7. 验证部署

```bash
# 检查服务状态
docker-compose ps

# 查看应用日志
docker-compose logs -f app

# 测试应用
curl http://localhost:3334
```

## Amazon Linux 2023 特性

- 使用 `dnf` 包管理器（替代yum）
- 默认用户通常是 `ec2-user`
- 内置Docker支持
- 优化的安全配置

## 常用管理命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app
docker-compose logs -f postgres
docker-compose logs -f redis

# 重启服务
docker-compose restart app

# 停止所有服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 进入容器
docker-compose exec app sh
docker-compose exec postgres psql -U postgres -d xnext
```

## 访问应用

部署完成后，通过以下地址访问：
- **应用**: `http://your-instance-ip:3334`
- **数据库**: `your-instance-ip:5432`
- **Redis**: `your-instance-ip:6379`

## 故障排除

### 1. 权限问题
```bash
# 确保用户有Docker权限
sudo usermod -aG docker ec2-user
# 重新登录或执行
newgrp docker
```

### 2. 端口访问问题
```bash
# 检查端口是否开放
sudo netstat -tulpn | grep :3334

# 检查防火墙状态
sudo systemctl status firewalld
```

### 3. 服务启动失败
```bash
# 查看详细日志
docker-compose logs app
docker-compose logs postgres
docker-compose logs redis

# 检查环境变量
cat .env
```

## 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build

# 运行数据库迁移
docker-compose exec app npx prisma migrate deploy
```
