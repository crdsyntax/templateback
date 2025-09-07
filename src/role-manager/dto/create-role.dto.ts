import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class PermissionDto {
  @ApiPropertyOptional({})
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiPropertyOptional({})
  @IsArray()
  @IsString({ each: true })
  actions: string[];

  @ApiPropertyOptional({})
  @IsOptional()
  conditions?: Record<string, any>;
}

export class CreateRoleDto {
  @ApiProperty({
    description: "Nombre del rol",
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole, { message: "name must be a valid UserRole" })
  @IsNotEmpty()
  name: UserRole;

  @ApiPropertyOptional({})
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({})
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean = false;

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
  permissions?: PermissionDto[] = [];

  @ApiPropertyOptional({})
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiPropertyOptional({})
  @IsOptional()
  metadata?: Record<string, any>;
}
