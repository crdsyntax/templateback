import { ApiProperty } from "@nestjs/swagger";
import { PermissionDto } from "./create-role.dto";

export class RoleResponseDto {
  @ApiProperty({ description: "Unique identifier of the role" })
  _id: string;

  @ApiProperty({ description: "Name of the role", example: "admin" })
  name: string;

  @ApiProperty({ description: "Description of the role", required: false })
  description?: string;

  @ApiProperty({
    description: "Whether this is a default role",
    example: false,
    default: false,
  })
  isDefault: boolean;

  @ApiProperty({
    description: "List of role names that this role inherits from",
    type: [String],
    default: [],
  })
  inheritedRoles: string[];

  @ApiProperty({
    description: "List of permissions associated with this role",
    type: [PermissionDto],
    default: [],
  })
  permissions: PermissionDto[];

  @ApiProperty({
    description: "Whether the role is active",
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "ID of the user who created this role",
    type: String,
    required: false,
  })
  createdBy?: string;

  @ApiProperty({
    description: "ID of the user who last updated this role",
    type: String,
    required: false,
  })
  updatedBy?: string;

  @ApiProperty({
    description: "Metadata associated with the role",
    type: Object,
    required: false,
  })
  metadata?: Record<string, any>;

  @ApiProperty({ description: "Date when the role was created" })
  createdAt: Date;

  @ApiProperty({ description: "Date when the role was last updated" })
  updatedAt: Date;
}
