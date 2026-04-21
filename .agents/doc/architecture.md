# Fastify 企业级后端项目技术文档

> 基于 Fastify + Bun + TypeScript 的企业级后端模板项目

## 目录

- [1. 项目概述](#1-项目概述)
- [2. 技术栈选型](#2-技术栈选型)
- [3. 必须中间件清单](#3-必须中间件清单)
- [4. 项目目录结构](#4-项目目录结构)
- [5. 核心架构设计](#5-核心架构设计)
- [6. 依赖库清单](#6-依赖库清单)
- [7. 分层架构详解](#7-分层架构详解)
- [8. 数据库设计](#8-数据库设计)
- [9. 认证与授权](#9-认证与授权)
- [10. API 设计规范](#10-api-设计规范)
- [11. 队列与异步任务](#11-队列与异步任务)
- [12. 日志系统](#12-日志系统)
- [13. 测试策略](#13-测试策略)
- [14. 部署与运维](#14-部署与运维)

---

## 1. 项目概述

本项目是一个企业级后端模板，旨在提供一套标准化、可扩展的后端架构方案。适用于以下场景：

- **Agent 项目后端**：支持 AI Agent 的后端服务，包含对话管理、知识库、任务调度等
- **纯后端项目**：通用的 RESTful API 服务，支持 RBAC 权限管理
- **快速启动**：提供完整的工程化配置，开箱即用

### 核心特性

- 基于 Fastify 框架的高性能 HTTP 服务
- Bun 运行时带来的原生 TypeScript 支持和极速启动
- 完整的分层架构（路由 → 控制器 → 服务 → 数据访问）
- Prisma ORM 提供类型安全的数据库操作
- JWT + RBAC + ACL 的完整权限体系
- Redis 缓存与会话管理
- 统一 API 响应格式与全局错误处理
- Swagger 自动文档生成
- 基于队列的异步任务处理
- 结构化日志记录

---

## 2. 技术栈选型

### 运行时与语言

| 技术 | 版本 | 说明 |
|------|------|------|
| Bun | latest | JavaScript 运行时，替代 Node.js |
| TypeScript | latest | 类型安全的 JavaScript 超集 |

### 核心框架

| 技术 | 版本 | 说明 |
|------|------|------|
| Fastify | 4.x | 高性能 Web 框架 |
| Prisma | 5.x | 类型安全的 ORM |
| Redis (ioredis) | 5.x | 缓存与消息队列 |

### 认证与安全

| 技术 | 版本 | 说明 |
|------|------|------|
| @fastify/jwt | 8.x | JWT 认证 |
| bcrypt | 5.x | 密码哈希（或使用 Bun.password） |

### 文档与验证

| 技术 | 版本 | 说明 |
|------|------|------|
| @fastify/swagger | 8.x | OpenAPI/Swagger 文档 |
| @fastify/swagger-ui | 3.x | Swagger UI 界面 |
| JSON Schema | - | Fastify 内置验证 |

### 队列与任务

| 技术 | 版本 | 说明 |
|------|------|------|
| BullMQ | 5.x | 基于 Redis 的队列系统 |

### 日志

| 技术 | 版本 | 说明 |
|------|------|------|
| Pino | 9.x | Fastify 内置日志（高性能） |
| pino-pretty | - | 开发环境日志美化 |

### 开发工具

| 技术 | 开发工具 | 版本 | 说明 |
|------|------|------|
| @fastify/autoload | - | 自动加载插件 |
| @fastify/env | - | 环境变量管理 |
| tsx | - | TypeScript 执行器（备用） |

---

## 3. 必须中间件清单

### 3.1 核心安全中间件（必须）

| 中间件 | 包名 | 用途 | 优先级 |
|--------|------|------|--------|
| **@fastify/helmet** | `@fastify/helmet` | 安全 HTTP 头（XSS、点击劫持防护） | 必须 |
| **@fastify/cors** | `@fastify/cors` | 跨域资源共享配置 | 必须 |
| **@fastify/rate-limit** | `@fastify/rate-limit` | 请求频率限制，防暴力攻击 | 必须 |
| **@fastify/csrf-protection** | `@fastify/csrf-protection` | CSRF 攻击防护 | 必须 |

### 3.2 性能优化中间件（必须）

| 中间件 | 包名 | 用途 | 优先级 |
|--------|------|------|--------|
| **@fastify/compress** | `@fastify/compress` | Gzip/Brotli 响应压缩，减少网络传输 | 必须 |
| **@fastify/under-pressure** | `@fastify/under-pressure` | 负载保护，防止服务过载（限流、熔断） | 必须 |

### 3.3 文件处理中间件（必须）

| 中间件 | 包名 | 用途 | 优先级 |
|--------|------|------|--------|
| **@fastify/multipart** | `@fastify/multipart` | 文件上传处理 | 必须 |
| **@fastify/static** | `@fastify/static` | 静态文件服务 | 推荐 |

### 3.4 数据库与缓存中间件（推荐）

| 中间件 | 包名 | 用途 | 优先级 |
|--------|------|------|--------|
| **@fastify/postgres** | `@fastify/postgres` | PostgreSQL 官方插件 | 推荐 |
| **@fastify/redis** | `@fastify/redis` | Redis 官方插件 | 推荐 |
| **@fastify/mongodb** | `@fastify/mongodb` | MongoDB 官方插件 | 可选 |

### 3.5 其他实用中间件（按需）

| 中间件 | 包名 | 用途 | 优先级 |
|--------|------|------|--------|
| **@fastify/view** | `@fastify/view` | 模板引擎支持（SSR） | 可选 |
| **@fastify/session** | `@fastify/session` | Session 管理 | 可选 |
| **@fastify/http-proxy** | `@fastify/http-proxy` | HTTP 代理（微服务网关） | 可选 |
| **@fastify/schedule** | `@fastify/schedule` | 定时任务调度 | 可选 |
| **piscina** | `piscina` | CPU 密集型任务 Worker 线程池 | 推荐 |
| **async-cache-dedupe** | `async-cache-dedupe` | 请求去重 + 缓存 | 推荐 |

### 3.6 中间件代码示例

#### 响应压缩

```ts
// src/plugins/compress.ts
import fp from 'fastify-plugin'
import fastifyCompress from '@fastify/compress'

export default fp(async (fastify) => {
  fastify.register(fastifyCompress, {
    global: true,
    threshold: 1024,
    encodings: ['gzip', 'deflate', 'br']
  })
})
```

#### 负载保护

```ts
// src/plugins/under-pressure.ts
import fp from 'fastify-plugin'
import underPressure from '@fastify/under-pressure'

export default fp(async (fastify) => {
  fastify.register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1500000000,
    maxEventLoopUtilization: 0.98,
    pressureHandler: (request, reply, type, value) => {
      reply.code(503).send({
        code: 503,
        message: '服务繁忙，请稍后重试',
        timestamp: new Date().toISOString()
      })
    }
  })
})
```

#### 文件上传

```ts
// src/plugins/multipart.ts
import fp from 'fastify-plugin'
import fastifyMultipart from '@fastify/multipart'

export default fp(async (fastify) => {
  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5
    }
  })
})
```

#### CSRF 防护

```ts
// src/plugins/csrf.ts
import fp from 'fastify-plugin'
import csrfProtection from '@fastify/csrf-protection'

export default fp(async (fastify) => {
  fastify.register(csrfProtection, {
    cookieOpts: {
      signed: true,
      httpOnly: true,
      secure: true
    }
  })
})
```

#### Worker 线程池（CPU 密集型任务）

```ts
// src/plugins/worker-pool.ts
import fp from 'fastify-plugin'
import Piscina from 'piscina'
import { join } from 'node:path'

export default fp(async (fastify) => {
  const piscina = new Piscina({
    filename: join(import.meta.dirname, 'workers', 'compute.js')
  })

  fastify.decorate('workerPool', piscina)

  fastify.addHook('onClose', async () => {
    await piscina.destroy()
  })
})
```

#### 请求去重 + 缓存

```ts
// src/plugins/cache.ts
import fp from 'fastify-plugin'
import { createCache } from 'async-cache-dedupe'
import Redis from 'ioredis'

export default fp(async (fastify) => {
  const redis = new Redis(Bun.env.REDIS_URL || 'redis://localhost:6379')

  const cache = createCache({
    ttl: 60,
    storage: { type: 'redis', options: { client: redis } }
  })

  fastify.decorate('cache', cache)

  fastify.addHook('onClose', async () => {
    await redis.quit()
  })
})
```

### 3.7 中间件注册顺序

```ts
// src/app.ts
import Fastify from 'fastify'

const app = Fastify({ logger: true })

// 1. 安全中间件（最先注册）
app.register(import('./plugins/helmet'))
app.register(import('./plugins/cors'))
app.register(import('./plugins/csrf'))

// 2. 性能中间件
app.register(import('./plugins/compress'))
app.register(import('./plugins/under-pressure'))

// 3. 日志
app.register(import('./plugins/logger'))

// 4. 数据库与缓存
app.register(import('./plugins/prisma'))
app.register(import('./plugins/redis'))
app.register(import('./plugins/cache'))

// 5. 认证
app.register(import('./plugins/jwt'))

// 6. 限流
app.register(import('./plugins/rate-limit'))

// 7. 文件上传
app.register(import('./plugins/multipart'))

// 8. Worker 线程池
app.register(import('./plugins/worker-pool'))

// 9. 文档
app.register(import('./plugins/swagger'))

// 10. 全局错误处理
app.register(import('./plugins/error-handler'))

// 11. 路由
app.register(import('./routes'))

export default app
```

---

## 4. 项目目录结构

```
project-root/
├── .agent/                          # AI Agent 配置目录
│   ├── agents.md                    # Agent 配置
│   ├── doc/                         # 项目文档
│   │   ├── prompt.md                # 需求说明
│   │   └── architecture.md          # 架构文档（本文件）
│   └── skills/                      # 技能定义
│       ├── belos-street/            # 编码规范
│       ├── bun/                     # Bun 运行时
│       └── fastify-best-practices/  # Fastify 最佳实践
│
├── src/
│   ├── app.ts                       # Fastify 应用入口
│   ├── server.ts                    # 服务器启动入口
│   │
│   ├── config/                      # 配置管理
│   │   ├── index.ts                 # 配置汇总
│   │   ├── app.ts                   # 应用配置
│   │   ├── database.ts              # 数据库配置
│   │   ├── redis.ts                 # Redis 配置
│   │   └── env.ts                   # 环境变量类型声明
│   │
│   ├── plugins/                     # Fastify 插件
│   │   ├── index.ts                 # 插件注册入口
│   │   ├── swagger.ts               # Swagger 文档插件
│   │   ├── jwt.ts                   # JWT 认证插件
│   │   ├── redis.ts                 # Redis 连接插件
│   │   ├── prisma.ts                # Prisma 连接插件
│   │   ├── cors.ts                  # CORS 配置插件
│   │   ├── helmet.ts                # 安全头插件
│   │   ├── rate-limit.ts            # 限流插件
│   │   ├── compress.ts              # 响应压缩插件
│   │   ├── under-pressure.ts        # 负载保护插件
│   │   ├── multipart.ts             # 文件上传插件
│   │   ├── csrf.ts                  # CSRF 防护插件
│   │   ├── worker-pool.ts           # Worker 线程池插件
│   │   └── cache.ts                 # 缓存插件
│   │
│   ├── routes/                      # 路由层（Router）
│   │   ├── index.ts                 # 路由注册入口
│   │   ├── auth/                    # 认证路由
│   │   │   ├── index.ts             # 路由定义
│   │   │   └── auth.schema.ts       # JSON Schema 验证
│   │   ├── user/                    # 用户路由
│   │   │   ├── index.ts
│   │   │   └── user.schema.ts
│   │   ├── agent/                   # Agent 路由
│   │   │   ├── index.ts
│   │   │   └── agent.schema.ts
│   │   ├── task/                    # 任务路由
│   │   │   ├── index.ts
│   │   │   └── task.schema.ts
│   │   └── knowledge/               # 知识库路由
│   │       ├── index.ts
│   │       └── knowledge.schema.ts
│   │
│   ├── controllers/                 # 控制器层（Controller）
│   │   ├── index.ts                 # 控制器导出
│   │   ├── auth.controller.ts       # 认证控制器
│   │   ├── user.controller.ts       # 用户控制器
│   │   ├── agent.controller.ts      # Agent 控制器
│   │   ├── task.controller.ts       # 任务控制器
│   │   └── knowledge.controller.ts  # 知识库控制器
│   │
│   ├── services/                    # 服务层（Service）
│   │   ├── index.ts                 # 服务导出
│   │   ├── auth.service.ts          # 认证服务
│   │   ├── user.service.ts          # 用户服务
│   │   ├── agent.service.ts         # Agent 服务
│   │   ├── task.service.ts          # 任务服务
│   │   ├── knowledge.service.ts     # 知识库服务
│   │   └── queue.service.ts         # 队列服务
│   │
│   ├── repositories/                # 数据访问层（Repository）
│   │   ├── index.ts                 # Repository 导出
│   │   ├── base.repository.ts       # 基础 Repository
│   │   ├── user.repository.ts       # 用户数据访问
│   │   ├── agent.repository.ts      # Agent 数据访问
│   │   ├── task.repository.ts       # 任务数据访问
│   │   └── knowledge.repository.ts  # 知识库数据访问
│   │
│   ├── middlewares/                 # 中间件
│   │   ├── index.ts                 # 中间件导出
│   │   ├── auth.middleware.ts       # 认证中间件
│   │   ├── permission.middleware.ts # 权限中间件
│   │   ├── validate.middleware.ts   # 验证中间件
│   │   └── error.middleware.ts      # 错误处理中间件
│   │
│   ├── decorators/                  # Fastify 装饰器
│   │   ├── index.ts                 # 装饰器导出
│   │   ├── user.decorator.ts        # 用户装饰器
│   │   └── permission.decorator.ts  # 权限装饰器
│   │
│   ├── hooks/                       # Fastify Hooks
│   │   ├── index.ts                 # Hooks 导出
│   │   ├── onRequest.ts             # 请求前 Hook
│   │   ├── onResponse.ts            # 响应后 Hook
│   │   └── onError.ts               # 错误 Hook
│   │
│   ├── types/                       # 类型定义
│   │   ├── index.ts                 # 类型导出
│   │   ├── api.types.ts             # API 响应类型
│   │   ├── auth.types.ts            # 认证相关类型
│   │   ├── user.types.ts            # 用户相关类型
│   │   ├── agent.types.ts           # Agent 相关类型
│   │   ├── task.types.ts            # 任务相关类型
│   │   ├── knowledge.types.ts       # 知识库相关类型
│   │   └── fastify.types.ts         # Fastify 扩展类型
│   │
│   ├── utils/                       # 工具函数
│   │   ├── index.ts                 # 工具导出
│   │   ├── response.ts              # 统一响应工具
│   │   ├── error.ts                 # 错误处理工具
│   │   ├── crypto.ts                # 加密工具
│   │   ├── date.ts                  # 日期工具
│   │   ├── validate.ts              # 验证工具
│   │   └── logger.ts                # 日志工具
│   │
│   ├── constants/                   # 常量定义
│   │   ├── index.ts                 # 常量导出
│   │   ├── http-status.ts           # HTTP 状态码
│   │   ├── error-codes.ts           # 错误码定义
│   │   ├── permissions.ts           # 权限常量
│   │   └── queue.ts                 # 队列常量
│   │
│   ├── jobs/                        # 队列任务定义
│   │   ├── index.ts                 # 任务导出
│   │   ├── email.job.ts             # 邮件任务
│   │   ├── notification.job.ts      # 通知任务
│   │   └── agent-log.job.ts         # Agent 日志任务
│   │
│   ├── prisma/                      # Prisma ORM 配置
│   │   ├── schema.prisma            # 数据库模型定义
│   │   ├── migrations/              # 数据库迁移文件
│   │   └── seed.ts                  # 种子数据
│   │
│   ├── workers/                     # Worker 线程池任务
│   │   ├── index.ts                 # Worker 导出
│   │   └── compute.js               # CPU 密集型任务
│   │
│   └── test/                        # 测试目录
│       ├── helpers/                 # 测试辅助工具
│       │   └── test-app.ts          # 测试应用工厂
│       ├── fixtures/                # 测试数据
│       │   └── users.ts             # 用户测试数据
│       ├── unit/                    # 单元测试
│       │   ├── services/
│       │   └── utils/
│       ├── integration/             # 集成测试
│       │   ├── routes/
│       │   └── repositories/
│       └── e2e/                     # 端到端测试
│           └── auth.e2e.ts
│
├── scripts/                         # 脚本文件
│   ├── seed.ts                      # 数据库种子
│   └── migrate.ts                   # 数据库迁移
│
├── .env                             # 环境变量
├── .env.example                     # 环境变量示例
├── .gitignore
├── package.json
├── tsconfig.json
├── bunfig.toml                      # Bun 配置
└── README.md
```

---

## 4. 核心架构设计

### 4.1 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                      Client / Browser                    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Routes (路由层)                        │
│  - 定义 HTTP 路由                                        │
│  - JSON Schema 验证                                      │
│  - 路由前缀与标签                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Controllers (控制器层)                   │
│  - 接收请求参数                                          │
│  - 调用 Service 层                                       │
│  - 返回统一响应格式                                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Services (服务层)                       │
│  - 业务逻辑处理                                          │
│  - 事务管理                                              │
│  - 调用 Repository 层                                    │
│  - 调用 Queue 服务                                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Repositories (数据访问层)                  │
│  - 数据库 CRUD 操作                                      │
│  - Prisma Client 封装                                    │
│  - 查询构建器                                            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Database (Prisma + PostgreSQL)               │
└─────────────────────────────────────────────────────────┘
```

### 4.2 请求处理流程

```
Request
  │
  ├─→ Fastify 内置 Hook (onRequest)
  │     └─→ CORS 检查
  │     └─→ Rate Limit 限流
  │
  ├─→ JWT 认证中间件
  │     └─→ 验证 Token
  │     └─→ 解析用户信息
  │
  ├─→ 权限中间件
  │     └─→ RBAC 角色检查
  │     └─→ ACL 权限检查
  │
  ├─→ JSON Schema 验证
  │     └─→ 请求体验证
  │     └─→ 参数验证
  │
  ├─→ Route Handler
  │     └─→ 调用 Controller
  │           └─→ 调用 Service
  │                 └─→ 调用 Repository
  │                       └─→ 数据库操作
  │
  ├─→ 响应序列化
  │     └─→ 统一响应格式
  │     └─→ 敏感字段过滤
  │
  └─→ Response
```

### 4.3 插件注册流程

```
src/app.ts
  │
  ├─→ 注册安全插件 (helmet, cors)
  ├─→ 注册日志插件 (pino)
  ├─→ 注册数据库插件 (prisma)
  ├─→ 注册缓存插件 (redis)
  ├─→ 注册认证插件 (jwt)
  ├─→ 注册文档插件 (swagger)
  ├─→ 注册限流插件 (rate-limit)
  ├─→ 注册全局错误处理
  ├─→ 注册路由
  └─→ 启动服务器
```

---

## 5. 依赖库清单

### 5.1 生产依赖

```json
{
  "dependencies": {
    "fastify": "^4.28.0",
    "@fastify/autoload": "^5.10.0",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/jwt": "^8.0.1",
    "@fastify/rate-limit": "^9.1.0",
    "@fastify/swagger": "^8.15.0",
    "@fastify/swagger-ui": "^3.0.0",
    "@fastify/sensible": "^5.6.0",
    "@prisma/client": "^5.17.0",
    "ioredis": "^5.4.1",
    "bullmq": "^5.12.0",
    "pino": "^9.3.0",
    "pino-pretty": "^11.2.0",
    "zod": "^3.23.0"
  }
}
```

### 5.2 开发依赖

```json
{
  "devDependencies": {
    "@types/bun": "^1.1.0",
    "prisma": "^5.17.0",
    "typescript": "^5.5.0",
    "tsx": "^4.16.0"
  }
}
```

### 5.3 Bun 内置能力（无需额外依赖）

| 功能 | Bun API | 说明 |
|------|---------|------|
| 环境变量 | `Bun.env` | 自动读取 .env 文件 |
| 文件操作 | `Bun.file()`, `Bun.write()` | 简化文件读写 |
| 密码哈希 | `Bun.password` | 内置 argon2 算法 |
| 哈希计算 | `Bun.hash()` | 内置哈希函数 |
| 测试框架 | `bun:test` | 零配置测试 |
| SQLite | `Bun.Database` | 内置 SQLite 支持 |

---

## 6. 分层架构详解

### 6.1 路由层 (Routes)

路由层负责定义 HTTP 路由、配置 JSON Schema 验证、设置路由元信息。

```ts
// src/routes/user/index.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { userController } from '@/controllers/user.controller'
import { createUserSchema, updateUserSchema, userParamsSchema } from './user.schema'

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    schema: {
      tags: ['User'],
      summary: '获取用户列表',
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number' },
            data: { type: 'array' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: userController.list
  })

  fastify.post('/', {
    schema: {
      tags: ['User'],
      summary: '创建用户',
      body: createUserSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            code: { type: 'number' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: userController.create
  })

  fastify.get('/:id', {
    schema: {
      tags: ['User'],
      summary: '获取用户详情',
      params: userParamsSchema
    },
    handler: userController.getById
  })

  fastify.put('/:id', {
    schema: {
      tags: ['User'],
      summary: '更新用户',
      params: userParamsSchema,
      body: updateUserSchema
    },
    handler: userController.update
  })

  fastify.delete('/:id', {
    schema: {
      tags: ['User'],
      summary: '删除用户',
      params: userParamsSchema
    },
    handler: userController.delete
  })
}
```

### 6.2 控制器层 (Controllers)

控制器层负责接收请求参数、调用服务层、返回统一响应格式。

```ts
// src/controllers/user.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { userService } from '@/services/user.service'
import { successResponse, createdResponse } from '@/utils/response'

export const userController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const users = await userService.findAll()
    return successResponse(users, '获取用户列表成功')
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const user = await userService.create(request.body as any)
    return createdResponse(user, '创建用户成功')
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const user = await userService.findById(id)
    return successResponse(user, '获取用户详情成功')
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const user = await userService.update(id, request.body as any)
    return successResponse(user, '更新用户成功')
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    await userService.delete(id)
    return successResponse(null, '删除用户成功')
  }
}
```

### 6.3 服务层 (Services)

服务层负责业务逻辑处理、事务管理、调用数据访问层。

```ts
// src/services/user.service.ts
import { prisma } from '@/plugins/prisma'
import { userRepository } from '@/repositories/user.repository'
import { queueService } from './queue.service'
import type { CreateUserInput, UpdateUserInput } from '@/types/user.types'

export const userService = {
  async findAll() {
    return userRepository.findMany({
      orderBy: { createdAt: 'desc' }
    })
  },

  async findById(id: string) {
    const user = await userRepository.findById(id)
    if (!user) {
      throw new Error('用户不存在')
    }
    return user
  },

  async create(input: CreateUserInput) {
    // 开启事务
    return prisma.$transaction(async (tx) => {
      const user = await userRepository.create(input, tx)
      
      // 发送欢迎邮件任务
      await queueService.add('email:welcome', {
        userId: user.id,
        email: user.email
      })
      
      return user
    })
  },

  async update(id: string, input: UpdateUserInput) {
    await this.findById(id) // 验证用户存在
    return userRepository.update(id, input)
  },

  async delete(id: string) {
    await this.findById(id) // 验证用户存在
    return userRepository.delete(id)
  }
}
```

### 6.4 数据访问层 (Repositories)

数据访问层负责数据库 CRUD 操作、封装 Prisma Client。

```ts
// src/repositories/base.repository.ts
import { PrismaClient } from '@prisma/client'

export class BaseRepository<Model> {
  constructor(protected model: any) {}

  async findMany(args?: any) {
    return this.model.findMany(args)
  }

  async findById(id: string) {
    return this.model.findUnique({ where: { id } })
  }

  async create(data: any, tx?: any) {
    const client = tx || this.model
    return client.create({ data })
  }

  async update(id: string, data: any) {
    return this.model.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    return this.model.delete({ where: { id } })
  }
}

// src/repositories/user.repository.ts
import { prisma } from '@/plugins/prisma'
import { BaseRepository } from './base.repository'

export class UserRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.user)
  }

  async findByEmail(email: string) {
    return this.model.findUnique({ where: { email } })
  }

  async findByApiKey(apiKey: string) {
    return this.model.findUnique({ where: { apiKey } })
  }
}

export const userRepository = new UserRepository()
```

---

## 7. 数据库设计

### 7.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户表
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String?
  avatar        String?
  apiKey        String    @unique @default(uuid())
  status        UserStatus @default(ACTIVE)
  roles         UserRole[]
  permissions   UserPermission[]
  agents        Agent[]
  tasks         Task[]
  conversations Conversation[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
}

// 角色表
model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  permissions RolePermission[]
  users       UserRole[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 权限表
model Permission {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  resource    String   // 资源标识，如 user, agent, task
  action      String   // 操作标识，如 create, read, update, delete
  roles       RolePermission[]
  users       UserPermission[]
  createdAt   DateTime @default(now())
}

// 用户角色关联表
model UserRole {
  id     String @id @default(uuid())
  userId String
  roleId String
  user   User   @relation(fields: [userId], references: [id])
  role   Role   @relation(fields: [roleId], references: [id])

  @@unique([userId, roleId])
}

// 角色权限关联表
model RolePermission {
  id           String @id @default(uuid())
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])

  @@unique([roleId, permissionId])
}

// 用户权限关联表（直接授权）
model UserPermission {
  id           String @id @default(uuid())
  userId       String
  permissionId String
  user         User       @relation(fields: [userId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])

  @@unique([userId, permissionId])
}

// Agent 表
model Agent {
  id          String   @id @default(uuid())
  name        String
  description String?
  config      Json     // Agent 配置
  status      AgentStatus @default(ACTIVE)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  tasks       Task[]
  logs        AgentLog[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum AgentStatus {
  ACTIVE
  INACTIVE
  DRAFT
}

// 任务表
model Task {
  id          String    @id @default(uuid())
  name        String
  type        TaskType
  status      TaskStatus @default(PENDING)
  input       Json?
  output      Json?
  error       String?
  progress    Int       @default(0)
  agentId     String?
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  agent       Agent?    @relation(fields: [agentId], references: [id])
  logs        TaskLog[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  startedAt   DateTime?
  completedAt DateTime?
}

enum TaskType {
  AGENT_RUN
  KNOWLEDGE_IMPORT
  EMAIL_SEND
  NOTIFICATION
}

enum TaskStatus {
  PENDING
  RUNNING
  SUCCESS
  FAILED
  CANCELLED
}

// Agent 日志表
model AgentLog {
  id        String   @id @default(uuid())
  agentId   String
  agent     Agent    @relation(fields: [agentId], references: [id])
  level     LogLevel @default(INFO)
  message   String
  metadata  Json?
  createdAt DateTime @default(now())
}

enum LogLevel {
  DEBUG
  INFO
  WARN
  ERROR
}

// 任务日志表
model TaskLog {
  id        String   @id @default(uuid())
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id])
  level     LogLevel @default(INFO)
  message   String
  metadata  Json?
  createdAt DateTime @default(now())
}

// 对话表
model Conversation {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  agentId    String?
  title      String?
  messages   Message[]
  metadata   Json?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// 消息表
model Message {
  id             String   @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  role           MessageRole
  content        String
  metadata       Json?
  createdAt      DateTime @default(now())
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

// 知识库表
model Knowledge {
  id          String   @id @default(uuid())
  title       String
  content     String
  type        KnowledgeType
  tags        String[]
  metadata    Json?
  userId      String
  status      KnowledgeStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum KnowledgeType {
  TEXT
  FILE
  URL
}

enum KnowledgeStatus {
  ACTIVE
  ARCHIVED
  DRAFT
}
```

---

## 8. 认证与授权

### 8.1 JWT 认证

```ts
// src/plugins/jwt.ts
import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async (fastify, opts) => {
  fastify.register(jwt, {
    secret: Bun.env.JWT_SECRET || 'your-secret-key',
    sign: {
      expiresIn: '7d',
      issuer: 'fastify-enterprise',
      audience: 'fastify-enterprise-users'
    }
  })

  // 装饰器：验证 JWT
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(401).send({
        code: 401,
        message: '未授权访问',
        error: 'Unauthorized'
      })
    }
  })
})
```

### 8.2 RBAC + ACL 权限

```ts
// src/middlewares/permission.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export const requirePermission = (resource: string, action: string) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any
    
    // 检查是否是超级管理员
    if (user.roles?.includes('ADMIN')) {
      return
    }

    // 检查用户直接权限
    const hasDirectPermission = user.permissions?.some(
      (p: any) => p.resource === resource && p.action === action
    )

    if (hasDirectPermission) {
      return
    }

    // 检查角色权限
    const hasRolePermission = user.rolePermissions?.some(
      (p: any) => p.resource === resource && p.action === action
    )

    if (!hasRolePermission) {
      reply.code(403).send({
        code: 403,
        message: `没有权限执行此操作: ${resource}:${action}`,
        error: 'Forbidden'
      })
    }
  }
}
```

### 8.3 API Key 认证

```ts
// src/middlewares/auth.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { userRepository } from '@/repositories/user.repository'

export const authenticateApiKey = async (request: FastifyRequest, reply: FastifyReply) => {
  const apiKey = request.headers['x-api-key'] as string

  if (!apiKey) {
    return reply.code(401).send({
      code: 401,
      message: '缺少 API Key',
      error: 'Unauthorized'
    })
  }

  const user = await userRepository.findByApiKey(apiKey)

  if (!user || user.status !== 'ACTIVE') {
    return reply.code(401).send({
      code: 401,
      message: '无效的 API Key',
      error: 'Unauthorized'
    })
  }

  // 将用户信息附加到请求对象
  request.user = user
}
```

---

## 9. API 设计规范

### 9.1 统一响应格式

```ts
// src/utils/response.ts
import { FastifyReply } from 'fastify'

export interface ApiResponse<T = any> {
  code: number
  data: T | null
  message: string
  timestamp: string
  requestId?: string
}

export const successResponse = <T>(data: T, message = '操作成功') => {
  return {
    code: 0,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}

export const createdResponse = <T>(data: T, message = '创建成功') => {
  return {
    code: 0,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}

export const errorResponse = (code: number, message: string, error?: string) => {
  return {
    code,
    data: null,
    message,
    error,
    timestamp: new Date().toISOString()
  }
}
```

### 9.2 全局错误处理

```ts
// src/middlewares/error.middleware.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { errorResponse } from '@/utils/response'

export default async function errorMiddleware(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, request, reply) => {
    const logger = fastify.log

    // 验证错误
    if (error.validation) {
      logger.warn({ validation: error.validation }, '验证失败')
      return reply.code(400).send(errorResponse(400, '请求参数验证失败', JSON.stringify(error.validation)))
    }

    // JWT 错误
    if (error.name === 'JsonWebTokenError') {
      return reply.code(401).send(errorResponse(401, '无效的 Token'))
    }

    if (error.name === 'TokenExpiredError') {
      return reply.code(401).send(errorResponse(401, 'Token 已过期'))
    }

    // 自定义业务错误
    if (error.statusCode) {
      return reply.code(error.statusCode).send(
        errorResponse(error.statusCode, error.message)
      )
    }

    // 未知错误
    logger.error({ err: error }, '服务器内部错误')
    return reply.code(500).send(errorResponse(500, '服务器内部错误'))
  })
}
```

### 9.3 API 路由示例

```
POST   /api/v1/auth/login          # 用户登录
POST   /api/v1/auth/register       # 用户注册
POST   /api/v1/auth/refresh        # 刷新 Token
POST   /api/v1/auth/logout         # 退出登录

GET    /api/v1/users               # 获取用户列表
GET    /api/v1/users/:id           # 获取用户详情
POST   /api/v1/users               # 创建用户
PUT    /api/v1/users/:id           # 更新用户
DELETE /api/v1/users/:id           # 删除用户

GET    /api/v1/agents              # 获取 Agent 列表
GET    /api/v1/agents/:id          # 获取 Agent 详情
POST   /api/v1/agents              # 创建 Agent
PUT    /api/v1/agents/:id          # 更新 Agent
DELETE /api/v1/agents/:id          # 删除 Agent
POST   /api/v1/agents/:id/run      # 运行 Agent

GET    /api/v1/tasks               # 获取任务列表
GET    /api/v1/tasks/:id           # 获取任务详情
POST   /api/v1/tasks               # 创建任务
PUT    /api/v1/tasks/:id/status    # 更新任务状态

GET    /api/v1/knowledge           # 获取知识库列表
GET    /api/v1/knowledge/:id       # 获取知识库详情
POST   /api/v1/knowledge           # 创建知识库
PUT    /api/v1/knowledge/:id       # 更新知识库
DELETE /api/v1/knowledge/:id       # 删除知识库

GET    /api/v1/conversations       # 获取对话列表
POST   /api/v1/conversations       # 创建对话
GET    /api/v1/conversations/:id   # 获取对话详情
POST   /api/v1/conversations/:id/messages  # 发送消息
```

---

## 10. 队列与异步任务

### 10.1 BullMQ 配置

```ts
// src/services/queue.service.ts
import { Queue, Worker, Job } from 'bullmq'
import { redis } from '@/plugins/redis'

export class QueueService {
  private queues: Map<string, Queue> = new Map()
  private workers: Map<string, Worker> = new Map()

  // 创建队列
  createQueue(name: string, options = {}) {
    const queue = new Queue(name, {
      connection: redis,
      ...options
    })
    this.queues.set(name, queue)
    return queue
  }

  // 添加任务
  async add(queueName: string, data: any, options = {}) {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`队列 ${queueName} 不存在`)
    }
    return queue.add(queueName, data, options)
  }

  // 创建 Worker
  createWorker(name: string, processor: (job: Job) => Promise<any>) {
    const worker = new Worker(name, processor, {
      connection: redis
    })
    this.workers.set(name, worker)
    return worker
  }

  // 获取任务状态
  async getJobStatus(queueName: string, jobId: string) {
    const queue = this.queues.get(queueName)
    if (!queue) {
      throw new Error(`队列 ${queueName} 不存在`)
    }
    const job = await queue.getJob(jobId)
    return job
  }
}

export const queueService = new QueueService()
```

### 10.2 任务定义

```ts
// src/jobs/email.job.ts
import { Job } from 'bullmq'
import { queueService } from '@/services/queue.service'

// 创建邮件队列
const emailQueue = queueService.createQueue('email')

// 创建邮件 Worker
queueService.createWorker('email', async (job: Job) => {
  const { to, subject, content } = job.data

  // 发送邮件逻辑
  console.log(`发送邮件到 ${to}: ${subject}`)
  
  // 模拟发送延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true }
})

export { emailQueue }
```

### 10.3 队列使用示例

```ts
// 在 Service 中使用队列
import { queueService } from './queue.service'

export const agentService = {
  async runAgent(agentId: string, input: any) {
    // 创建异步任务
    const job = await queueService.add('agent:run', {
      agentId,
      input,
      timestamp: new Date().toISOString()
    }, {
      priority: 1,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      }
    })

    return {
      taskId: job.id,
      status: 'PENDING'
    }
  }
}
```

---

## 11. 日志系统

### 11.1 Pino 日志配置

```ts
// src/config/logger.ts
import type { FastifyLoggerOptions } from 'fastify'

export const loggerConfig: FastifyLoggerOptions = {
  level: Bun.env.LOG_LEVEL || 'info',
  transport: Bun.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: true
        }
      }
    : undefined,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      path: req.path,
      parameters: req.params
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  }
}
```

### 11.2 日志使用

```ts
// 在 Fastify 中使用日志
fastify.get('/users', async (request, reply) => {
  fastify.log.info({ userId: request.user?.id }, '获取用户列表')
  
  try {
    const users = await userService.findAll()
    fastify.log.debug({ count: users.length }, '查询完成')
    return successResponse(users)
  } catch (error) {
    fastify.log.error({ err: error }, '获取用户列表失败')
    throw error
  }
})
```

### 11.3 日志级别

| 级别 | 说明 | 使用场景 |
|------|------|----------|
| `trace` | 最详细 | 调试追踪信息 |
| `debug` | 调试 | 开发环境调试信息 |
| `info` | 信息 | 一般信息，如请求日志 |
| `warn` | 警告 | 潜在问题，如慢查询 |
| `error` | 错误 | 错误信息，如异常 |
| `fatal` | 致命 | 系统级错误 |

---

## 12. 测试策略

### 12.1 测试目录结构

```
test/
├── helpers/
│   └── test-app.ts          # 测试应用工厂
├── fixtures/
│   └── users.ts             # 测试数据
├── unit/                    # 单元测试
│   ├── services/
│   │   └── user.service.test.ts
│   └── utils/
│       └── response.test.ts
├── integration/             # 集成测试
│   ├── routes/
│   │   └── auth.test.ts
│   └── repositories/
│       └── user.repository.test.ts
└── e2e/                     # 端到端测试
    └── auth.e2e.ts
```

### 12.2 单元测试示例

```ts
// test/unit/services/user.service.test.ts
import { test, expect, describe, beforeEach, mock } from 'bun:test'
import { userService } from '@/services/user.service'
import { userRepository } from '@/repositories/user.repository'

describe('UserService', () => {
  beforeEach(() => {
    mock.restore()
  })

  test('findAll 应该返回用户列表', async () => {
    const mockUsers = [
      { id: '1', email: 'user1@test.com', name: 'User 1' },
      { id: '2', email: 'user2@test.com', name: 'User 2' }
    ]

    mock.module('@/repositories/user.repository', () => ({
      userRepository: {
        findMany: () => mockUsers
      }
    }))

    const users = await userService.findAll()
    expect(users).toHaveLength(2)
    expect(users[0].email).toBe('user1@test.com')
  })

  test('findById 应该在用户不存在时抛出错误', async () => {
    mock.module('@/repositories/user.repository', () => ({
      userRepository: {
        findById: () => null
      }
    }))

    await expect(userService.findById('non-existent')).rejects.toThrow('用户不存在')
  })
})
```

### 12.3 集成测试示例

```ts
// test/integration/routes/auth.test.ts
import { test, expect, describe } from 'bun:test'
import { buildTestApp } from '@/test/helpers/test-app'

describe('Auth Routes', () => {
  test('POST /auth/login 应该返回 Token', async () => {
    const app = await buildTestApp()

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin@test.com',
        password: 'password123'
      }
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body.code).toBe(0)
    expect(body.data).toHaveProperty('token')
  })

  test('POST /auth/login 应该在密码错误时返回 401', async () => {
    const app = await buildTestApp()

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'admin@test.com',
        password: 'wrong-password'
      }
    })

    expect(response.statusCode).toBe(401)
  })
})
```

---

## 13. 部署与运维

### 13.1 环境变量配置

```env
# .env.example

# 应用配置
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=debug

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/fastify_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limit
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### 13.2 Docker 部署

```dockerfile
# Dockerfile
FROM oven/bun:1-alpine AS base

WORKDIR /app

# 安装依赖
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# 构建
FROM base AS builder
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

# 生产镜像
FROM base AS runner
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "dist/server.js"]
```

### 13.3 Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/fastify_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=fastify_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
  redis_data:
```

### 13.4 启动脚本

```json
{
  "scripts": {
    "dev": "bun --watch src/server.ts",
    "build": "bun build src/server.ts --outdir dist --target bun",
    "start": "bun dist/server.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "bun prisma/seed.ts",
    "db:studio": "prisma studio",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "lint": "bunx tsc --noEmit",
    "typecheck": "bunx tsc --noEmit"
  }
}
```

---

## 附录

### A. 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd fastify-enterprise

# 2. 安装依赖
bun install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 4. 数据库迁移
bun run db:generate
bun run db:migrate
bun run db:seed

# 5. 启动开发服务器
bun run dev
```

### B. 项目模板变体

#### Agent 项目模板

在基础模板上增加：
- Agent 配置管理
- 对话历史存储
- 知识库管理
- Agent 日志记录
- Function Calling 支持

#### 纯后端项目模板

移除 Agent 相关模块，保留：
- 用户管理
- RBAC 权限
- 任务队列
- 通用 CRUD

### C. 性能优化建议

1. **使用 JSON Schema 序列化响应**：减少响应体积
2. **启用 gzip/brotli 压缩**：减少网络传输
3. **Redis 缓存热点数据**：减少数据库查询
4. **数据库连接池**：复用数据库连接
5. **异步任务队列**：将耗时操作放入队列
6. **日志异步写入**：避免阻塞请求

### D. 安全最佳实践

1. **始终使用 HTTPS**：生产环境强制 HTTPS
2. **CORS 白名单**：仅允许可信域名
3. **Rate Limiting**：防止暴力攻击
4. **输入验证**：使用 JSON Schema 验证所有输入
5. **SQL 注入防护**：使用 Prisma 参数化查询
6. **XSS 防护**：设置 Content-Security-Policy
7. **敏感信息加密**：密码使用 bcrypt/argon2

---

> 本文档由 AI 辅助生成，基于 Fastify 官方文档和最佳实践编写。
> 最后更新时间：2026-04-21
