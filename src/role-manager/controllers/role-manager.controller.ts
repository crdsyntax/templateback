import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { RoleManagerService } from "../services/role-manager.service";
import { CreateRoleDto } from "../dto/create-role.dto";
import {
  UpdateRoleDto,
  UpdateRolePermissionsDto,
  UpdateRoleStatusDto,
} from "../dto/update-role.dto";
import { RoleResponseDto } from "../dto/role-response.dto";

import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";

@ApiTags("roles")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("roles")
export class RoleManagerController {
  constructor(private readonly roleManagerService: RoleManagerService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Create a new role" })
  @ApiResponse({
    status: 201,
    description: "The role has been successfully created.",
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({
    status: 409,
    description: "Role with this name already exists",
  })
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req
  ): Promise<RoleResponseDto> {
    return this.roleManagerService.create(createRoleDto, req.user.userid);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get all roles with pagination" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (starts from 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of items per page",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search term for role name or description",
  })
  @ApiQuery({
    name: "isActive",
    required: false,
    type: Boolean,
    description: "Filter by active status",
  })
  @ApiResponse({
    status: 200,
    description: "List of roles",
    type: [RoleResponseDto],
  })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query("search") search?: string,
    @Query("isActive") isActive?: boolean
  ): Promise<{ data: RoleResponseDto[]; total: number }> {
    limit = limit > 100 ? 100 : limit;
    return this.roleManagerService.findAll(page, limit, search, isActive);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get a role by ID" })
  @ApiParam({ name: "id", description: "Role ID" })
  @ApiResponse({
    status: 200,
    description: "The found role",
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 404, description: "Role not found" })
  async findOne(@Param("id") id: string): Promise<RoleResponseDto> {
    return this.roleManagerService.findOne(id);
  }

  @Get("name/:name")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Get a role by name" })
  @ApiParam({ name: "name", description: "Role name" })
  @ApiResponse({
    status: 200,
    description: "The found role",
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 404, description: "Role not found" })
  async findByName(@Param("name") name: string): Promise<RoleResponseDto> {
    const role = await this.roleManagerService.findByName(name);
    if (!role) {
      throw new NotFoundException(`Role with name '${name}' not found`);
    }
    return role;
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Update a role" })
  @ApiParam({ name: "id", description: "Role ID" })
  @ApiResponse({
    status: 200,
    description: "The updated role",
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Cannot modify system role",
  })
  @ApiResponse({ status: 404, description: "Role not found" })
  async update(
    @Param("id") id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req
  ): Promise<RoleResponseDto> {
    return this.roleManagerService.update(id, updateRoleDto, req.user.userId);
  }

  @Patch(":id/permissions")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Update role permissions" })
  @ApiParam({ name: "id", description: "Role ID" })
  @ApiBody({ type: UpdateRolePermissionsDto })
  @ApiResponse({
    status: 200,
    description: "The updated role with new permissions",
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 404, description: "Role not found" })
  async updatePermissions(
    @Param("id") id: string,
    @Body() updateDto: UpdateRolePermissionsDto,
    @Request() req
  ): Promise<RoleResponseDto> {
    return this.roleManagerService.updatePermissions(
      id,
      updateDto,
      req?.user?.userId
    );
  }

  @Patch(":id/status")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Update role status (active/inactive)" })
  @ApiParam({ name: "id", description: "Role ID" })
  @ApiResponse({
    status: 200,
    description: "The updated role with new status",
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Cannot deactivate default role",
  })
  @ApiResponse({ status: 404, description: "Role not found" })
  async updateStatus(
    @Param("id") id: string,
    @Body() updateStatusDto: UpdateRoleStatusDto,
    @Request() req
  ): Promise<RoleResponseDto> {
    return this.roleManagerService.updateStatus(
      id,
      updateStatusDto,
      req?.user?.userId
    );
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Delete a role" })
  @ApiParam({ name: "id", description: "Role ID" })
  @ApiResponse({ status: 200, description: "Role has been deleted" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Cannot delete system role or role in use",
  })
  @ApiResponse({ status: 404, description: "Role not found" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.roleManagerService.remove(id);
  }

  @Get(":id/effective-permissions")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary:
      "Get effective permissions for a role (including inherited permissions)",
  })
  @ApiParam({ name: "id", description: "Role ID" })
  @ApiResponse({
    status: 200,
    description: "List of effective permissions",
    type: [Object],
  })
  @ApiResponse({ status: 404, description: "Role not found" })
  async getEffectivePermissions(
    @Param("id") id: string
  ): Promise<Array<Record<string, any>>> {
    return this.roleManagerService.getEffectivePermissions(id);
  }
}
