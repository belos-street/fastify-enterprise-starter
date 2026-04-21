1. 该项目是一个基于 Fastify 框架的模板项目
2. 技术栈使用 bun 作为运行环境 + TypeScript 为编程语言
3. 我需要用fastify来做企业级后端项目，所以需要严格控制代码结构

你现在需要帮我：
1. 设计项目目录结构
2. 必须要引用的库
 比如：
    TypeScript + Fastify 工程化
    路由、控制器、服务分层
    Prisma ORM（存用户、对话、Agent 日志、任务、知识库）
    Redis
    JWT 登录、简单权限（多用户、API Key 隔离）
    API统一返回、全局错误处理
    Swagger 文档（给 Function Calling 用）
    基础队列（异步任务、邮件、推送、耗时操作）
    RBAC+ACL权限
    日志记录（如 Winston）
    ...等等
3. 设计为通用的企业级模板，方便我可以快速创建agent项目(有后端服务的)或者纯后端项目