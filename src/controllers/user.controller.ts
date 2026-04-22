import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserService } from '../services/user.service'
import { success, error, paginated } from '../utils/response'
import type { UserCreateInput, UserUpdateInput } from '@prisma/client'

const userService = new UserService()

export class UserController {
  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, pageSize = 10 } = request.query as Record<string, number>
    const result = await userService.getUsers(page, pageSize)
    return reply.send(paginated(result.list, result.total, result.page, result.pageSize))
  }

  async getUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    try {
      const user = await userService.getUser(id)
      return reply.send(success(user))
    } catch (e) {
      return reply.code(404).send(error((e as Error).message))
    }
  }

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UserCreateInput
    try {
      const user = await userService.createUser(data)
      return reply.code(201).send(success(user, 'User created'))
    } catch (e) {
      return reply.code(400).send(error((e as Error).message))
    }
  }

  async updateUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const data = request.body as UserUpdateInput
    try {
      const user = await userService.updateUser(id, data)
      return reply.send(success(user, 'User updated'))
    } catch (e) {
      return reply.code(400).send(error((e as Error).message))
    }
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    try {
      await userService.deleteUser(id)
      return reply.send(success(null, 'User deleted'))
    } catch (e) {
      return reply.code(400).send(error((e as Error).message))
    }
  }
}
