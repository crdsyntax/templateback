import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDTO } from "../dto/create-user.dto";
import { PaginatedUsers, UserRepository } from "../repositorys/user.repository";
import * as bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { AssignRolesDto } from "../dto/assign-roles.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  async create(input: CreateUserDTO) {
    const exists = await this.userRepository.findByUsername(input.username);
    if (exists) throw new BadRequestException("Username already exists");

    const passwordHash = await bcrypt.hash(input.password || "1234", 10);

    const user = await this.userRepository.create({
      username: input.username,
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return { message: "Usuario creado.", id: user.id };
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async assignRoles(userId: string, assignRolesDto: AssignRolesDto) {
    const user = await this.findById(userId);

    const roleIds = assignRolesDto.roles.map((id) => new Types.ObjectId(id));
    user.roles = roleIds;
    await user.save();
    return { message: "Roles assigned successfully" };
  }

  async getUserWithRoles(userId: string) {
    const user = await this.userRepository.findById(userId, {
      populate: "roles",
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async getUserByRol(
    roleId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedUsers> {
    const users = await this.userRepository.findByRoleId(roleId, {
      page,
      limit,
    });

    if (users.data.length === 0) {
      throw new NotFoundException(`No users found with role ID ${roleId}`);
    }

    return users;
  }
}
