import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto, PermissionDto } from "./create-role.dto";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "../enums/user-role.enum";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiPropertyOptional({
    description: "Nombre del rol",
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole, { message: "name must be a valid UserRole" })
  @IsOptional()
  name?: UserRole;

  @ApiPropertyOptional({})
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({})
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: "Roles heredados (nombres)",
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inheritedRoles?: string[];

  @ApiPropertyOptional({})
  @IsArray()
  @IsOptional()
  permissions?: PermissionDto[];

  @ApiPropertyOptional({})
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({})
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateRolePermissionsDto {
  @ApiPropertyOptional({})
  @IsArray()
  @IsOptional()
  addPermissions?: PermissionDto[];

  @ApiPropertyOptional({})
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  removePermissionIds?: string[];
}

export class UpdateRoleStatusDto {
  @IsBoolean()
  isActive: boolean;
}
