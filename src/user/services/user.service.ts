import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UserRepository } from "../repositorys/user.repository";
import * as bcrypt from "bcryptjs";

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
}
