import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import * as bcrypt from "bcryptjs";
import { CreateUserDTO } from "../dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<any> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(input: CreateUserDTO): Promise<{ message: string; id: number }> {
    const exists = await this.userModel.findOne({ username: input.username });
    if (exists) throw new BadRequestException("Username already exists");

    const passwordHash = await bcrypt.hash(input.password || "1234", 10);

    const created = new this.userModel({
      username: input.username,
      name: input.name,
      email: input.email,
      passwordHash,
    });
    const user = await created.save();

    return { message: "Usuario creado.", id: user.id };
  }
}
