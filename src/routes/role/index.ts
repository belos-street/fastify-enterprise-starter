import type { FastifyInstance } from "fastify";
import { RoleController } from "../../controllers/role.controller";

const roleController = new RoleController();

export default async function roleRoutes(fastify: FastifyInstance) {
  fastify.get("/", roleController.getRoles.bind(roleController));
  fastify.get("/:id", roleController.getRole.bind(roleController));
  fastify.post("/", roleController.createRole.bind(roleController));
  fastify.put("/:id", roleController.updateRole.bind(roleController));
  fastify.delete("/:id", roleController.deleteRole.bind(roleController));
}
