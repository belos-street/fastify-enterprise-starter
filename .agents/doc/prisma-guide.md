# Prisma 快速上手指南

> 基于 Prisma 7 + MySQL + TypeScript 的企业级 ORM 使用指南

---

## 目录

1. [Prisma 是什么](#1-prisma-是什么)
2. [项目配置](#2-项目配置)
3. [Schema 语法](#3-schema-语法)
4. [常用命令](#4-常用命令)
5. [CRUD 操作](#5-crud-操作)
6. [关联查询](#6-关联查询)
7. [事务处理](#7-事务处理)
8. [分页与排序](#8-分页与排序)
9. [类型安全](#9-类型安全)
10. [最佳实践](#10-最佳实践)
11. [常见问题](#11-常见问题)

---

## 1. Prisma 是什么

Prisma 是一个下一代 ORM，为 Node.js 和 TypeScript 提供类型安全的数据库访问。

### 核心优势

| 特性 | 说明 |
|------|------|
| **类型安全** | 自动生成 TypeScript 类型，编译时检查错误 |
| **自动迁移** | Schema 变更自动同步到数据库 |
| **查询构建器** | 链式 API，无需手写 SQL |
| **关联查询** | 轻松处理一对多、多对多关系 |
| **事务支持** | 内置事务 API，保证数据一致性 |

---

## 2. 项目配置

### 2.1 配置文件

**prisma.config.ts** - Prisma 7 配置入口

```ts
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'src/prisma/schema.prisma',  // Schema 文件位置
  datasource: {
    url: process.env.DATABASE_URL,      // 从环境变量读取
  },
  migrations: {
    path: 'src/prisma/migrations',      // 迁移文件存放位置
  },
})
```

**.env** - 环境变量

```env
DATABASE_URL="mysql://root:密码@localhost:3306/数据库名"
```

### 2.2 Schema 文件结构

```prisma
// 生成 TypeScript 客户端
generator client {
  provider = "prisma-client-js"
}

// 数据库配置
datasource db {
  provider = "mysql"
}

// 数据模型
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  email     String   @unique
  createdAt DateTime @default(now())
  
  @@map("users")  // 数据库表名
}
```

---

## 3. Schema 语法

### 3.1 字段类型

| Prisma 类型 | MySQL 类型 | 说明 |
|-------------|------------|------|
| `String` | VARCHAR | 字符串 |
| `Int` | INT | 整数 |
| `Float` | FLOAT | 浮点数 |
| `Boolean` | BOOLEAN | 布尔值 |
| `DateTime` | DATETIME | 日期时间 |
| `Json` | JSON | JSON 对象 |
| `Bytes` | BLOB | 二进制数据 |
| `Decimal` | DECIMAL | 高精度小数 |

### 3.2 字段修饰符

```prisma
model User {
  id        String   @id @default(uuid())    // 主键，默认 UUID
  username  String   @unique                 // 唯一索引
  email     String   @unique
  password  String                           // 必填
  nickname  String?                          // 可选（?）
  status    UserStatus @default(ACTIVE)      // 默认值
  createdAt DateTime @default(now())         // 创建时间
  updatedAt DateTime @updatedAt              // 自动更新时间
  
  @@map("users")
}
```

### 3.3 枚举类型

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  BANNED
}
```

### 3.4 关系定义

**一对多**

```prisma
model User {
  id        String   @id @default(uuid())
  posts     Post[]   // 一个用户有多个帖子
}

model Post {
  id       String @id @default(uuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

**多对多（通过中间表）**

```prisma
model User {
  id    String     @id @default(uuid())
  roles UserRole[] // 一个用户有多个角色
}

model Role {
  id    String     @id @default(uuid())
  users UserRole[] // 一个角色有多个用户
}

model UserRole {
  id     String @id @default(uuid())
  userId String
  roleId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role   @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  @@unique([userId, roleId])  // 联合唯一索引
}
```

### 3.5 索引

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  status    String
  createdAt DateTime @default(now())
  
  @@index([status, createdAt])  // 复合索引
  @@map("users")
}
```

---

## 4. 常用命令

| 命令 | 说明 |
|------|------|
| `bunx prisma generate` | 生成 TypeScript 客户端 |
| `bunx prisma db push` | 同步 Schema 到数据库（开发环境） |
| `bunx prisma migrate dev` | 创建并应用迁移（生产环境） |
| `bunx prisma migrate status` | 查看迁移状态 |
| `bunx prisma migrate reset` | 重置数据库 |
| `bunx prisma studio` | 打开可视化数据库管理工具 |
| `bunx prisma validate` | 验证 Schema 语法 |
| `bunx prisma format` | 格式化 Schema 文件 |

---

## 5. CRUD 操作

### 5.1 创建 Prisma Client

```ts
// src/prisma/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 5.2 创建（Create）

```ts
// 创建单个用户
const user = await prisma.user.create({
  data: {
    username: 'admin',
    email: 'admin@example.com',
    password: 'hashed_password',
  },
})

// 创建并关联角色
const userWithRole = await prisma.user.create({
  data: {
    username: 'admin',
    email: 'admin@example.com',
    password: 'hashed_password',
    roles: {
      create: {
        role: {
          connect: { id: 'role-id' },
        },
      },
    },
  },
  include: { roles: true },
})
```

### 5.3 查询（Read）

```ts
// 查询单个
const user = await prisma.user.findUnique({
  where: { id: 'uuid' },
})

// 查询单个（非唯一字段）
const user = await prisma.user.findFirst({
  where: { email: 'admin@example.com' },
})

// 查询列表
const users = await prisma.user.findMany()
```

### 5.4 更新（Update）

```ts
// 更新单个字段
const user = await prisma.user.update({
  where: { id: 'uuid' },
  data: { nickname: '管理员' },
})

// 更新多个字段
const user = await prisma.user.update({
  where: { id: 'uuid' },
  data: {
    nickname: '管理员',
    avatar: 'https://example.com/avatar.jpg',
  },
})

// 更新或创建（不存在则创建）
const user = await prisma.user.upsert({
  where: { email: 'admin@example.com' },
  update: { nickname: '新昵称' },
  create: {
    username: 'admin',
    email: 'admin@example.com',
    password: 'hashed',
  },
})
```

### 5.5 删除（Delete）

```ts
// 删除单个
const user = await prisma.user.delete({
  where: { id: 'uuid' },
})

// 删除多个
const deleted = await prisma.user.deleteMany({
  where: { status: 'BANNED' },
})
```

---

## 6. 关联查询

### 6.1 包含关联数据

```ts
// 查询用户及其角色
const user = await prisma.user.findUnique({
  where: { id: 'uuid' },
  include: {
    roles: {
      include: {
        role: true,
      },
    },
  },
})
```

### 6.2 过滤关联数据

```ts
// 查询用户及其活跃的角色
const user = await prisma.user.findUnique({
  where: { id: 'uuid' },
  include: {
    roles: {
      where: {
        role: {
          isSystem: true,
        },
      },
    },
  },
})
```

### 6.3 通过关联查询

```ts
// 查询拥有某个角色的用户
const users = await prisma.user.findMany({
  where: {
    roles: {
      some: {
        role: {
          name: 'admin',
        },
      },
    },
  },
})
```

### 6.4 关联计数

```ts
// 查询用户及其角色数量
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: { roles: true },
    },
  },
})
```

---

## 7. 事务处理

### 7.1 批量事务

```ts
const [user, role] = await prisma.$transaction([
  prisma.user.create({
    data: { username: 'admin', email: 'admin@example.com', password: 'hashed' },
  }),
  prisma.role.create({
    data: { name: 'admin', description: '管理员' },
  }),
])
```

### 7.2 交互式事务

```ts
const result = await prisma.$transaction(async (tx) => {
  // 1. 创建用户
  const user = await tx.user.create({
    data: { username: 'admin', email: 'admin@example.com', password: 'hashed' },
  })
  
  // 2. 分配角色
  await tx.userRole.create({
    data: { userId: user.id, roleId: 'admin-role-id' },
  })
  
  // 3. 记录日志
  await tx.taskLog.create({
    data: {
      message: `User ${user.username} created`,
      level: 'info',
    },
  })
  
  return user
})
```

---

## 8. 分页与排序

### 8.1 基础分页

```ts
const users = await prisma.user.findMany({
  skip: 0,           // 跳过数量
  take: 10,          // 每页数量
  orderBy: {
    createdAt: 'desc',  // 排序
  },
})
```

### 8.2 游标分页（推荐）

```ts
const users = await prisma.user.findMany({
  take: 10,
  cursor: { id: 'last-id' },  // 从某个 ID 开始
  skip: 1,                    // 跳过游标本身
  orderBy: { id: 'asc' },
})
```

### 8.3 多字段排序

```ts
const users = await prisma.user.findMany({
  orderBy: [
    { status: 'asc' },
    { createdAt: 'desc' },
  ],
})
```

---

## 9. 类型安全

### 9.1 自动生成的类型

```ts
import type {
  User,              // 完整用户类型
  UserCreateInput,   // 创建用户输入
  UserUpdateInput,   // 更新用户输入
  UserWhereInput,    // 查询条件
  UserStatus,        // 枚举类型
} from '@prisma/client'
```

### 9.2 在函数中使用

```ts
import type { UserCreateInput, User } from '@prisma/client'

async function createUser(data: UserCreateInput): Promise<User> {
  return prisma.user.create({ data })
}
```

### 9.3 选择字段

```ts
// 只选择部分字段，类型会自动推断
const user = await prisma.user.findUnique({
  where: { id: 'uuid' },
  select: {
    id: true,
    username: true,
    email: true,
  },
})
// user 类型: { id: string, username: string, email: string } | null
```

---

## 10. 最佳实践

### 10.1 单例模式

```ts
// 避免在开发环境热重载时创建多个连接
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 10.2 软删除

```prisma
model User {
  id        String   @id @default(uuid())
  deletedAt DateTime?  // 软删除字段
  
  @@map("users")
}
```

```ts
// 查询时排除已删除的
const users = await prisma.user.findMany({
  where: { deletedAt: null },
})
```

### 10.3 密码加密

```ts
import { hash, verify } from 'bun:password'

// 创建时加密
const user = await prisma.user.create({
  data: {
    username: 'admin',
    password: await hash(password, 'bcrypt'),
  },
})

// 登录时验证
const isValid = await verify(user.password, inputPassword)
```

### 10.4 批量操作

```ts
// 批量创建
await prisma.user.createMany({
  data: [
    { username: 'user1', email: 'user1@example.com', password: 'hashed' },
    { username: 'user2', email: 'user2@example.com', password: 'hashed' },
  ],
  skipDuplicates: true,
})

// 批量更新
await prisma.user.updateMany({
  where: { status: 'INACTIVE' },
  data: { status: 'BANNED' },
})
```

### 10.5 原始 SQL

```ts
// 当 Prisma API 无法满足时
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE status = 'ACTIVE'
`

// 带参数
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`
```

---

## 11. 常见问题

### Q1: 如何查看生成的 SQL？

```ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### Q2: 如何处理并发连接？

```ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      connectionLimit: 10,  // 连接池大小
    },
  },
})
```

### Q3: 如何重置数据库？

```bash
bunx prisma migrate reset  # 删除所有数据并重新迁移
```

### Q4: 如何添加新字段？

1. 在 `schema.prisma` 中添加字段
2. 运行 `bunx prisma db push`（开发）或 `bunx prisma migrate dev`（生产）
3. 运行 `bunx prisma generate` 更新类型

### Q5: 如何处理可选关联？

```ts
const user = await prisma.user.findUnique({
  where: { id: 'uuid' },
  include: {
    roles: true,  // 如果没有关联，返回空数组 []
  },
})
```

---

## 快速参考卡片

```ts
// 初始化
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 查询
prisma.user.findUnique({ where: { id } })
prisma.user.findMany({ where, skip, take, orderBy })

// 创建
prisma.user.create({ data })
prisma.user.createMany({ data: [] })

// 更新
prisma.user.update({ where, data })
prisma.user.updateMany({ where, data })

// 删除
prisma.user.delete({ where })
prisma.user.deleteMany({ where })

// 事务
prisma.$transaction([op1, op2])
prisma.$transaction(async (tx) => { ... })

// 原始 SQL
prisma.$queryRaw`SELECT ...`
prisma.$executeRaw`UPDATE ...`
```

---

> 最后更新：2026-04-21
