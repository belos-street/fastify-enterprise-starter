# Fastify 企业级项目开发计划

> 基于 Fastify + Bun + TypeScript 的企业级后端模板项目

## 项目进度总览

- [ ] Phase 1: 项目初始化与基础配置
- [ ] Phase 2: 数据库与 ORM 配置
- [ ] Phase 3: 核心插件开发
- [ ] Phase 4: 类型定义与工具函数
- [ ] Phase 5: 数据访问层（Repository）
- [ ] Phase 6: 服务层（Service）
- [ ] Phase 7: 控制器层（Controller）
- [ ] Phase 8: 路由层（Routes）
- [ ] Phase 9: 认证与授权
- [ ] Phase 10: 队列与异步任务
- [ ] Phase 11: 测试
- [ ] Phase 12: 文档与部署

---

## Phase 1: 项目初始化与基础配置

### 1.1 项目结构创建
- [x] 创建 `src/` 目录结构
- [x] 创建 `src/config/` 配置目录
- [x] 创建 `src/plugins/` 插件目录
- [x] 创建 `src/routes/` 路由目录
- [x] 创建 `src/controllers/` 控制器目录
- [x] 创建 `src/services/` 服务目录
- [x] 创建 `src/repositories/` 数据访问目录
- [x] 创建 `src/middlewares/` 中间件目录
- [x] 创建 `src/decorators/` 装饰器目录
- [x] 创建 `src/hooks/` Hooks 目录
- [x] 创建 `src/types/` 类型定义目录
- [x] 创建 `src/utils/` 工具函数目录
- [x] 创建 `src/constants/` 常量定义目录
- [x] 创建 `src/jobs/` 队列任务目录
- [x] 创建 `src/prisma/` Prisma 配置目录
- [x] 创建 `src/workers/` Worker 线程目录
- [x] 创建 `src/test/` 测试目录

### 1.2 配置文件
- [~] 创建 `tsconfig.json` TypeScript 配置（已有）
- [~] 创建 `bunfig.toml` Bun 配置（已有）
- [~] 创建 `.env.example` 环境变量示例（已有）
- [~] 创建 `.gitignore` Git 忽略文件（已有）
- [~] 配置 `package.json` 脚本命令（已有）

### 1.3 基础依赖安装
- [x] 安装 Fastify 核心依赖
- [x] 安装 Fastify 官方插件
- [x] 安装 Prisma ORM
- [x] 安装 Redis 客户端
- [x] 安装 BullMQ 队列
- [~] 安装开发工具依赖（Bun 原生支持 TS + 自带测试，无需额外安装）

---

## Phase 2: 数据库与 ORM 配置

### 2.1 Prisma 配置
- [x] 创建 `src/prisma/schema.prisma` 数据库模型
- [x] 定义 User 模型
- [x] 定义 Role 模型
- [ ] 定义 Permission 模型
- [ ] 定义 UserRole 关联模型
- [ ] 定义 RolePermission 关联模型
- [ ] 定义 UserPermission 关联模型
- [ ] 定义 Agent 模型
- [ ] 定义 Task 模型
- [ ] 定义 AgentLog 模型
- [ ] 定义 TaskLog 模型
- [ ] 定义 Conversation 模型
- [ ] 定义 Message 模型
- [ ] 定义 Knowledge 模型

### 2.2 数据库初始化
- [ ] 运行 `prisma generate` 生成客户端
- [ ] 运行 `prisma migrate dev` 创建迁移
- [ ] 创建 `src/prisma/seed.ts` 种子数据
- [ ] 添加初始管理员用户种子
- [ ] 添加初始角色种子
- [ ] 添加初始权限种子

---

## Phase 3: 核心插件开发

### 3.1 安全插件
- [ ] 创建 `src/plugins/helmet.ts` 安全头插件
- [ ] 创建 `src/plugins/cors.ts` CORS 配置插件
- [ ] 创建 `src/plugins/csrf.ts` CSRF 防护插件
- [ ] 创建 `src/plugins/rate-limit.ts` 限流插件

### 3.2 性能插件
- [ ] 创建 `src/plugins/compress.ts` 响应压缩插件
- [ ] 创建 `src/plugins/under-pressure.ts` 负载保护插件

### 3.3 数据库插件
- [ ] 创建 `src/plugins/prisma.ts` Prisma 连接插件
- [ ] 创建 `src/plugins/redis.ts` Redis 连接插件
- [ ] 创建 `src/plugins/cache.ts` 缓存插件

### 3.4 认证插件
- [ ] 创建 `src/plugins/jwt.ts` JWT 认证插件

### 3.5 文件处理插件
- [ ] 创建 `src/plugins/multipart.ts` 文件上传插件

### 3.6 Worker 插件
- [ ] 创建 `src/plugins/worker-pool.ts` Worker 线程池插件

### 3.7 文档插件
- [ ] 创建 `src/plugins/swagger.ts` Swagger 文档插件

### 3.8 插件注册
- [ ] 创建 `src/plugins/index.ts` 插件注册入口
- [ ] 配置插件注册顺序

---

## Phase 4: 类型定义与工具函数

### 4.1 类型定义
- [ ] 创建 `src/types/index.ts` 类型导出
- [ ] 创建 `src/types/api.types.ts` API 响应类型
- [ ] 创建 `src/types/auth.types.ts` 认证相关类型
- [ ] 创建 `src/types/user.types.ts` 用户相关类型
- [ ] 创建 `src/types/agent.types.ts` Agent 相关类型
- [ ] 创建 `src/types/task.types.ts` 任务相关类型
- [ ] 创建 `src/types/knowledge.types.ts` 知识库相关类型
- [ ] 创建 `src/types/fastify.types.ts` Fastify 扩展类型

### 4.2 常量定义
- [ ] 创建 `src/constants/index.ts` 常量导出
- [ ] 创建 `src/constants/http-status.ts` HTTP 状态码
- [ ] 创建 `src/constants/error-codes.ts` 错误码定义
- [ ] 创建 `src/constants/permissions.ts` 权限常量
- [ ] 创建 `src/constants/queue.ts` 队列常量

### 4.3 工具函数
- [ ] 创建 `src/utils/index.ts` 工具导出
- [ ] 创建 `src/utils/response.ts` 统一响应工具
- [ ] 创建 `src/utils/error.ts` 错误处理工具
- [ ] 创建 `src/utils/crypto.ts` 加密工具
- [ ] 创建 `src/utils/date.ts` 日期工具
- [ ] 创建 `src/utils/validate.ts` 验证工具
- [ ] 创建 `src/utils/logger.ts` 日志工具

---

## Phase 5: 数据访问层（Repository）

### 5.1 基础 Repository
- [ ] 创建 `src/repositories/index.ts` Repository 导出
- [ ] 创建 `src/repositories/base.repository.ts` 基础 Repository 类

### 5.2 业务 Repository
- [ ] 创建 `src/repositories/user.repository.ts` 用户数据访问
- [ ] 创建 `src/repositories/agent.repository.ts` Agent 数据访问
- [ ] 创建 `src/repositories/task.repository.ts` 任务数据访问
- [ ] 创建 `src/repositories/knowledge.repository.ts` 知识库数据访问

---

## Phase 6: 服务层（Service）

### 6.1 基础服务
- [ ] 创建 `src/services/index.ts` 服务导出
- [ ] 创建 `src/services/queue.service.ts` 队列服务

### 6.2 业务服务
- [ ] 创建 `src/services/auth.service.ts` 认证服务
- [ ] 创建 `src/services/user.service.ts` 用户服务
- [ ] 创建 `src/services/agent.service.ts` Agent 服务
- [ ] 创建 `src/services/task.service.ts` 任务服务
- [ ] 创建 `src/services/knowledge.service.ts` 知识库服务

---

## Phase 7: 控制器层（Controller）

### 7.1 控制器创建
- [ ] 创建 `src/controllers/index.ts` 控制器导出
- [ ] 创建 `src/controllers/auth.controller.ts` 认证控制器
- [ ] 创建 `src/controllers/user.controller.ts` 用户控制器
- [ ] 创建 `src/controllers/agent.controller.ts` Agent 控制器
- [ ] 创建 `src/controllers/task.controller.ts` 任务控制器
- [ ] 创建 `src/controllers/knowledge.controller.ts` 知识库控制器

---

## Phase 8: 路由层（Routes）

### 8.1 路由 Schema
- [ ] 创建 `src/routes/auth/auth.schema.ts` 认证 Schema
- [ ] 创建 `src/routes/user/user.schema.ts` 用户 Schema
- [ ] 创建 `src/routes/agent/agent.schema.ts` Agent Schema
- [ ] 创建 `src/routes/task/task.schema.ts` 任务 Schema
- [ ] 创建 `src/routes/knowledge/knowledge.schema.ts` 知识库 Schema

### 8.2 路由定义
- [ ] 创建 `src/routes/index.ts` 路由注册入口
- [ ] 创建 `src/routes/auth/index.ts` 认证路由
- [ ] 创建 `src/routes/user/index.ts` 用户路由
- [ ] 创建 `src/routes/agent/index.ts` Agent 路由
- [ ] 创建 `src/routes/task/index.ts` 任务路由
- [ ] 创建 `src/routes/knowledge/index.ts` 知识库路由

---

## Phase 9: 认证与授权

### 9.1 中间件
- [ ] 创建 `src/middlewares/index.ts` 中间件导出
- [ ] 创建 `src/middlewares/auth.middleware.ts` 认证中间件
- [ ] 创建 `src/middlewares/permission.middleware.ts` 权限中间件
- [ ] 创建 `src/middlewares/validate.middleware.ts` 验证中间件
- [ ] 创建 `src/middlewares/error.middleware.ts` 错误处理中间件

### 9.2 装饰器
- [ ] 创建 `src/decorators/index.ts` 装饰器导出
- [ ] 创建 `src/decorators/user.decorator.ts` 用户装饰器
- [ ] 创建 `src/decorators/permission.decorator.ts` 权限装饰器

### 9.3 Hooks
- [ ] 创建 `src/hooks/index.ts` Hooks 导出
- [ ] 创建 `src/hooks/onRequest.ts` 请求前 Hook
- [ ] 创建 `src/hooks/onResponse.ts` 响应后 Hook
- [ ] 创建 `src/hooks/onError.ts` 错误 Hook

---

## Phase 10: 队列与异步任务

### 10.1 队列任务
- [ ] 创建 `src/jobs/index.ts` 任务导出
- [ ] 创建 `src/jobs/email.job.ts` 邮件任务
- [ ] 创建 `src/jobs/notification.job.ts` 通知任务
- [ ] 创建 `src/jobs/agent-log.job.ts` Agent 日志任务

### 10.2 Worker 线程
- [ ] 创建 `src/workers/index.ts` Worker 导出
- [ ] 创建 `src/workers/compute.js` CPU 密集型任务示例

---

## Phase 11: 应用入口与启动

### 11.1 应用入口
- [ ] 创建 `src/app.ts` Fastify 应用入口
- [ ] 创建 `src/server.ts` 服务器启动入口
- [ ] 配置插件注册顺序
- [ ] 配置路由注册
- [ ] 配置全局错误处理

### 11.2 配置管理
- [ ] 创建 `src/config/index.ts` 配置汇总
- [ ] 创建 `src/config/app.ts` 应用配置
- [ ] 创建 `src/config/database.ts` 数据库配置
- [ ] 创建 `src/config/redis.ts` Redis 配置
- [ ] 创建 `src/config/env.ts` 环境变量类型声明

---

## Phase 12: 测试

### 12.1 测试配置
- [ ] 创建 `src/test/helpers/test-app.ts` 测试应用工厂
- [ ] 创建 `src/test/fixtures/users.ts` 用户测试数据

### 12.2 单元测试
- [ ] 创建 `src/test/unit/services/user.service.test.ts` 用户服务测试
- [ ] 创建 `src/test/unit/utils/response.test.ts` 响应工具测试

### 12.3 集成测试
- [ ] 创建 `src/test/integration/routes/auth.test.ts` 认证路由测试
- [ ] 创建 `src/test/integration/repositories/user.repository.test.ts` 用户 Repository 测试

### 12.4 E2E 测试
- [ ] 创建 `src/test/e2e/auth.e2e.ts` 认证 E2E 测试

---

## Phase 13: 文档与部署

### 13.1 文档
- [ ] 更新 `README.md` 项目说明
- [ ] 生成 Swagger 文档
- [ ] 编写 API 接口文档

### 13.2 部署配置
- [ ] 创建 `Dockerfile` Docker 配置
- [ ] 创建 `docker-compose.yml` Docker Compose 配置
- [ ] 配置环境变量
- [ ] 配置生产环境日志

### 13.3 脚本
- [ ] 创建 `scripts/seed.ts` 数据库种子脚本
- [ ] 创建 `scripts/migrate.ts` 数据库迁移脚本

---

## 快速参考

### 开发命令

```bash
# 启动开发服务器
bun run dev

# 构建项目
bun run build

# 运行生产服务器
bun run start

# 数据库操作
bun run db:generate    # 生成 Prisma 客户端
bun run db:migrate     # 运行数据库迁移
bun run db:push        # 推送数据库 schema
bun run db:seed        # 运行种子数据
bun run db:studio      # 打开 Prisma Studio

# 测试
bun run test           # 运行测试
bun run test:watch     # 监听模式运行测试
bun run test:coverage  # 运行测试并生成覆盖率报告

# 代码检查
bun run lint           # TypeScript 类型检查
bun run typecheck      # TypeScript 类型检查
```

### 目录结构

```
src/
├── app.ts                       # Fastify 应用入口
├── server.ts                    # 服务器启动入口
├── config/                      # 配置管理
├── plugins/                     # Fastify 插件
├── routes/                      # 路由层
├── controllers/                 # 控制器层
├── services/                    # 服务层
├── repositories/                # 数据访问层
├── middlewares/                 # 中间件
├── decorators/                  # Fastify 装饰器
├── hooks/                       # Fastify Hooks
├── types/                       # 类型定义
├── utils/                       # 工具函数
├── constants/                   # 常量定义
├── jobs/                        # 队列任务定义
├── prisma/                      # Prisma ORM 配置
├── workers/                     # Worker 线程池任务
└── test/                        # 测试目录
```

---

> 本文档用于跟踪项目开发进度，每完成一个任务请勾选对应项。
> 最后更新时间：2026-04-21
