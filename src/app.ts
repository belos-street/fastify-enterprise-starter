import Fastify from 'fastify'
import cors from '@fastify/cors'
import userRoutes from './routes/user'
import roleRoutes from './routes/role'

const app = Fastify({
  logger: true,
})

await app.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
})

app.register(userRoutes, { prefix: '/api/users' })
app.register(roleRoutes, { prefix: '/api/roles' })

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

export default app
