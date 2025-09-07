import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { User, UserDocument } from "../schemas/user.schema";
import { BaseRepository } from "src/common/base.repository";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  data: UserDocument[];
  total: number;
  limit: number;
  page: number;
}

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).populate("roles").exec();
  }

  async findById<T = UserDocument>(
    id: string | Types.ObjectId,
    options?: { populate?: string | string[] },
  ): Promise<T | null> {
    let query = this.userModel.findById(id);

    if (options?.populate) {
      const paths = Array.isArray(options.populate)
        ? options.populate
        : [options.populate];

      for (const pathStr of paths) {
        const [path, ...fields] = pathStr.split(" ");
        const select = fields.length > 0 ? fields.join(" ") : undefined;
        query = query.populate({ path, select });
      }
    }

    const user = await query.exec();
    return user as T | null;
  }

  async updateUserRoles(
    userId: string | Types.ObjectId,
    roleIds: Types.ObjectId[],
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { $set: { roles: roleIds } }, { new: true })
      .populate("roles")
      .exec();
  }

  async findByRoleId(
    roleId: string,
    options: PaginationOptions = {},
  ): Promise<PaginatedUsers> {
    if (!Types.ObjectId.isValid(roleId)) {
      throw new BadRequestException(`${roleId} is not a valid ObjectId`);
    }

    const roleObjectId = new Types.ObjectId(roleId);

    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find({ roles: roleObjectId })
        .populate("roles")
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments({ roles: roleObjectId }),
    ]);

    return { data, total, limit, page };
  }
}
