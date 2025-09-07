import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  RoleManager,
  RoleManagerDocument,
} from "../schemas/role-manager.schema";
import { CreateRoleDto, PermissionDto } from "../dto/create-role.dto";
import {
  UpdateRoleDto,
  UpdateRolePermissionsDto,
  UpdateRoleStatusDto,
} from "../dto/update-role.dto";
import { RoleResponseDto } from "../dto/role-response.dto";
import { safeNumber } from "@/common/services/common-functions";
import { UserRole } from "../enums/user-role.enum";

@Injectable()
export class RoleManagerService {
  constructor(
    @InjectModel(RoleManager.name)
    private roleModel: Model<RoleManagerDocument>,
  ) {}

  private toRoleResponse(role: RoleManagerDocument): RoleResponseDto {
    return role.toObject();
  }

  async create(
    createRoleDto: CreateRoleDto,
    userId: string,
  ): Promise<RoleResponseDto> {
    const existingRole = await this.roleModel
      .findOne({ name: createRoleDto.name })
      .exec();
    if (existingRole) {
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists`,
      );
    }

    const inheritedRoles = createRoleDto.inheritedRoles || [];

    if (createRoleDto.isDefault) {
      await this.roleModel
        .updateMany({ isDefault: true }, { $set: { isDefault: false } })
        .exec();
    }

    if (inheritedRoles?.length > 0) {
      const existingRoles = await this.roleModel
        .find({
          name: { $in: createRoleDto.inheritedRoles },
        })
        .exec();

      if (existingRoles.length !== inheritedRoles.length) {
        const existingRoleNames = existingRoles.map((r) => r.name);
        const missingRoles = inheritedRoles.filter(
          (name) => !existingRoleNames.includes(UserRole[name]),
        );
        throw new BadRequestException(
          `The following roles do not exist: ${missingRoles.join(", ")}`,
        );
      }
    }

    const permissions = (createRoleDto.permissions || []).map((perm) => ({
      actions: Array.isArray(perm.actions) ? perm.actions : [],
      conditions: perm.conditions || {},
    }));

    const createdRole = new this.roleModel({
      ...createRoleDto,
      permissions,
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    });

    const savedRole = await createdRole.save();
    return this.toRoleResponse(savedRole);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    isActive?: boolean,
  ): Promise<{ data: RoleResponseDto[]; total: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const [roles, total] = await Promise.all([
      this.roleModel
        .find(query)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.roleModel.countDocuments(query).exec(),
    ]);

    return {
      data: roles.map((role) => this.toRoleResponse(role)),
      total,
    };
  }

  async findOne(id: string): Promise<RoleResponseDto> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }
    return this.toRoleResponse(role);
  }

  async findByName(name: string): Promise<RoleResponseDto | null> {
    const role = await this.roleModel.findOne({ name }).exec();
    return role ? this.toRoleResponse(role) : null;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    userId: string,
  ): Promise<RoleResponseDto> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }
    if (role.isDefault && !updateRoleDto.isActive) {
      throw new ForbiddenException("Cannot deactivate default role");
    }

    if (updateRoleDto.isDefault) {
      await this.roleModel
        .updateMany(
          { _id: { $ne: id }, isDefault: true },
          { $set: { isDefault: false } },
        )
        .exec();
    }

    const inheritedRoles = updateRoleDto.inheritedRoles || [];

    if (safeNumber(inheritedRoles?.length) > 0) {
      const existingRoles = await this.roleModel
        .find({
          name: { $in: inheritedRoles },
        })
        .exec();

      if (existingRoles.length !== inheritedRoles.length) {
        const existingRoleNames = existingRoles.map((r) => r.name);
        const missingRoles = inheritedRoles.filter(
          (name) => !existingRoleNames.includes(UserRole[name]),
        );
        throw new BadRequestException(
          `The following roles do not exist: ${missingRoles.join(", ")}`,
        );
      }

      const visited = new Set<string>([role.name]);
      const stack = [...inheritedRoles];

      while (stack.length > 0) {
        const currentRoleName = stack.pop()!;
        if (visited.has(currentRoleName)) {
          throw new BadRequestException(
            "Circular dependency detected in role inheritance",
          );
        }
        visited.add(currentRoleName);

        const currentRole = await this.roleModel
          .findOne({ name: currentRoleName })
          .exec();
        if (currentRole?.inheritedRoles?.length) {
          stack.push(...currentRole.inheritedRoles);
        }
      }
    }

    // Procesar permisos para asegurar que actions siempre esté presente y sea array
    const permissions = (updateRoleDto.permissions || []).map((perm) => ({
      actions: Array.isArray(perm.actions) ? perm.actions : [],
      conditions: perm.conditions || {},
    }));

    const updateFields: any = {
      updatedBy: new Types.ObjectId(userId),
      updatedAt: new Date(),
    };
    if (typeof updateRoleDto.name !== "undefined")
      updateFields.name = updateRoleDto.name;
    if (typeof updateRoleDto.description !== "undefined")
      updateFields.description = updateRoleDto.description;
    if (typeof updateRoleDto.isDefault !== "undefined")
      updateFields.isDefault = updateRoleDto.isDefault;
    if (typeof updateRoleDto.isActive !== "undefined")
      updateFields.isActive = updateRoleDto.isActive;
    if (typeof updateRoleDto.inheritedRoles !== "undefined")
      updateFields.inheritedRoles = updateRoleDto.inheritedRoles;
    if (typeof updateRoleDto.permissions !== "undefined")
      updateFields.permissions = permissions;
    if (typeof updateRoleDto.metadata !== "undefined")
      updateFields.metadata = updateRoleDto.metadata;

    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, updateFields, { new: true })
      .exec();

    if (!updatedRole) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    return this.toRoleResponse(updatedRole);
  }

  async updatePermissions(
    id: string,
    updateDto: UpdateRolePermissionsDto,
    userId: string,
  ): Promise<RoleResponseDto> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    const update: any = {
      updatedBy: new Types.ObjectId(userId),
      updatedAt: new Date(),
    };

    if (updateDto.addPermissions?.length) {
      update.$push = { permissions: { $each: updateDto.addPermissions } };
    }

    if (updateDto.removePermissionIds?.length) {
      update.$pull = {
        permissions: { _id: { $in: updateDto.removePermissionIds } },
      };
    }

    const updatedRole = await this.roleModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();

    if (!updatedRole) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    return this.toRoleResponse(updatedRole);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateRoleStatusDto,
    userId: string,
  ): Promise<RoleResponseDto> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    if (role.isDefault && !updateStatusDto.isActive) {
      throw new ForbiddenException("Cannot deactivate default role");
    }

    const updatedRole = await this.roleModel
      .findByIdAndUpdate(
        id,
        {
          isActive: updateStatusDto.isActive,
          updatedBy: new Types.ObjectId(userId),
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedRole) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    return this.toRoleResponse(updatedRole);
  }

  async remove(id: string): Promise<void> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }

    if (role.isDefault) {
      throw new ForbiddenException("Cannot delete default role");
    }

    const userCount = await this.roleModel.countDocuments({ "roles.role": id });
    if (userCount > 0) {
      throw new ConflictException(
        `Cannot delete role '${role.name}' as it is assigned to ${userCount} user(s)`,
      );
    }

    await this.roleModel.findByIdAndDelete(id).exec();
  }

  async getEffectivePermissions(roleId: string): Promise<PermissionDto[]> {
    const role = await this.roleModel.findById(roleId).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${roleId}' not found`);
    }

    const visited = new Set<string>();
    const permissionsMap = new Map<string, PermissionDto>();

    const collectPermissions = async (currentRoleId: string) => {
      if (visited.has(currentRoleId)) return;
      visited.add(currentRoleId);

      const currentRole = await this.roleModel.findById(currentRoleId).exec();
      if (!currentRole) return;

      /*       for (const permission of currentRole.permissions) {
        const key = `${permission.resource}:${permission.actions.sort().join(",")}`;
        if (!permissionsMap.has(key)) {
          permissionsMap.set(key, { ...permission });
        }
      } */

      for (const inheritedRoleName of currentRole.inheritedRoles || []) {
        const inheritedRole = await this.roleModel
          .findOne({ name: inheritedRoleName })
          .exec();
        if (inheritedRole) {
          await collectPermissions(inheritedRole._id.toString());
        }
      }
    };

    await collectPermissions(roleId);
    return Array.from(permissionsMap.values());
  }
}
