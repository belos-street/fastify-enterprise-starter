import type { FastifyInstance } from "fastify";
import { UserController } from "../../controllers/user.controller";

const userController = new UserController();

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/", userController.getUsers.bind(userController));
  fastify.get("/:id", userController.getUser.bind(userController));
  fastify.post("/", userController.createUser.bind(userController));
  fastify.put("/:id", userController.updateUser.bind(userController));
  fastify.delete("/:id", userController.deleteUser.bind(userController));
}
