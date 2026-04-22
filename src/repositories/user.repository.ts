import { prisma } from '../prisma/client'
import type { User, UserCreateInput, UserUpdateInput } from '@prisma/client'

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    })
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async findAll(page = 1, pageSize = 10) {
    const [list, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            include: { role: true },
          },
        },
      }),
      prisma.user.count(),
    ])
    return { list, total, page, pageSize }
  }

  async create(data: UserCreateInput) {
    return prisma.user.create({ data })
  }

  async update(id: string, data: UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  }

  async existsByUsername(username: string) {
    const count = await prisma.user.count({ where: { username } })
    return count > 0
  }

  async existsByEmail(email: string) {
    const count = await prisma.user.count({ where: { email } })
    return count > 0
  }
}
