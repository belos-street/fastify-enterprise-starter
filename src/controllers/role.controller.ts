import type { FastifyReply, FastifyRequest } from 'fastify'
import { RoleService } from '../services/role.service'
import { success, error, paginated } from '../utils/response'
import type { Prisma } from '@prisma/client'

const roleService = new RoleService()

export class RoleController {
  async getRoles(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, pageSize = 10 } = request.query as Record<string, number>
    const result = await roleService.getRoles(page, pageSize)
    return reply.send(paginated(result.list, result.total, result.page, result.pageSize))
  }

  async getRole(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    try {
      const role = await roleService.getRole(id)
      return reply.send(success(role))
    } catch (e) {
      return reply.code(404).send(error((e as Error).message))
    }
  }

  async createRole(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as Prisma.RoleCreateInput
    try {
      const role = await roleService.createRole(data)
      return reply.code(201).send(success(role, 'Role created'))
    } catch (e) {
      return reply.code(400).send(error((e as Error).message))
    }
  }

  async updateRole(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    const data = request.body as Prisma.RoleUpdateInput
    try {
      const role = await roleService.updateRole(id, data)
      return reply.send(success(role, 'Role updated'))
    } catch (e) {
      return reply.code(400).send(error((e as Error).message))
    }
  }

  async deleteRole(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }
    try {
      await roleService.deleteRole(id)
      return reply.send(success(null, 'Role deleted'))
    } catch (e) {
      return reply.code(400).send(error((e as Error).message))
    }
  }
}
