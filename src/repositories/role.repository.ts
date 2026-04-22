import { prisma } from '../prisma/client'
import type { Role, Prisma } from '@prisma/client'

export class RoleRepository {
  async findById(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        users: {
          include: { user: true },
        },
      },
    })
  }

  async findByName(name: string) {
    return prisma.role.findUnique({ where: { name } })
  }

  async findAll(page = 1, pageSize = 10) {
    const [list, total] = await Promise.all([
      prisma.role.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { users: true },
          },
        },
      }),
      prisma.role.count(),
    ])
    return { list, total, page, pageSize }
  }

  async create(data: Prisma.RoleCreateInput) {
    return prisma.role.create({ data })
  }

  async update(id: string, data: Prisma.RoleUpdateInput) {
    return prisma.role.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.role.delete({ where: { id } })
  }

  async existsByName(name: string) {
    const count = await prisma.role.count({ where: { name } })
    return count > 0
  }
}
