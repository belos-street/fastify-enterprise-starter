import { RoleRepository } from '../repositories/role.repository'
import type { Prisma } from '@prisma/client'

const roleRepository = new RoleRepository()

export class RoleService {
  async getRole(id: string) {
    const role = await roleRepository.findById(id)
    if (!role) throw new Error('Role not found')
    return role
  }

  async getRoles(page: number, pageSize: number) {
    return roleRepository.findAll(page, pageSize)
  }

  async createRole(data: Prisma.RoleCreateInput) {
    const exists = await roleRepository.existsByName(data.name as string)
    if (exists) throw new Error('Role name already exists')

    return roleRepository.create(data)
  }

  async updateRole(id: string, data: Prisma.RoleUpdateInput) {
    await roleRepository.findById(id)
    return roleRepository.update(id, data)
  }

  async deleteRole(id: string) {
    await roleRepository.findById(id)
    return roleRepository.delete(id)
  }
}
