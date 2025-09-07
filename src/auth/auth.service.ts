import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { UserRepository } from "../user/repositorys/user.repository";
import { UserDocument } from "../user/schemas/user.schema";
import { RoleManagerDocument } from "../role-manager/schemas/role-manager.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserDocument | null> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return null;

    return user;
  }

  async login(user: UserDocument & { _id: Types.ObjectId }) {
    const userId = user._id.toString();

    const userWithRoles = await this.userRepo.findById(userId, {
      populate: "roles name _id",
    });
    const roles = userWithRoles?.roles || [];
    const roleNames: string[] = roles.map(
      (role: Types.ObjectId | RoleManagerDocument) =>
        role instanceof Types.ObjectId ? "" : role.name
    );

    const payload = {
      username: user.username,
      sub: userId,
      roles: roleNames,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userId,
        username: user.username,
        name: user.name,
        email: user.email,
        roles: roles.map((role: Types.ObjectId | RoleManagerDocument) => ({
          id:
            role instanceof Types.ObjectId
              ? role.toString()
              : role._id.toString(),
          name: role instanceof Types.ObjectId ? "" : role.name,
        })),
      },
    };
  }
}
