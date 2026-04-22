import { UserRepository } from '../repositories/user.repository'
import type { UserCreateInput, UserUpdateInput } from '@prisma/client'

const userRepository = new UserRepository()

export class UserService {
  async getUser(id: string) {
    const user = await userRepository.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }

  async getUsers(page: number, pageSize: number) {
    return userRepository.findAll(page, pageSize)
  }

  async createUser(data: UserCreateInput) {
    const usernameExists = await userRepository.existsByUsername(data.username)
    if (usernameExists) throw new Error('Username already exists')

    const emailExists = await userRepository.existsByEmail(data.email)
    if (emailExists) throw new Error('Email already exists')

    return userRepository.create(data)
  }

  async updateUser(id: string, data: UserUpdateInput) {
    await userRepository.findById(id)
    return userRepository.update(id, data)
  }

  async deleteUser(id: string) {
    await userRepository.findById(id)
    return userRepository.delete(id)
  }
}
