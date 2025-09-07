import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../dto/create-user.dto";
import { AssignRolesDto } from "../dto/assign-roles.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";

@Controller("users")
@ApiTags("Users")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new user",
    description: "Creates a new user with the provided details.",
  })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Username already exists" })
  async createUser(
    @Body() body: CreateUserDTO
  ): Promise<{ message: string; id: string }> {
    return this.userService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: "List all users",
    description: "Returns a list of all users.",
  })
  @ApiResponse({ status: 200, description: "List of users" })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get user by ID",
    description: "Returns a single user by ID.",
  })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 404, description: "User not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.userService.getUserWithRoles(id);
  }

  @Get("get/:id/roles")
  @ApiOperation({
    summary: "Get users by roleId",
    description: "Returns users by `roleId`.",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of items per page",
  })
  @ApiResponse({ status: 200, description: "Users found" })
  @ApiResponse({ status: 404, description: "Users not found" })
  async findByRole(
    @Param("id") id: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.userService.getUserByRol(id, pageNumber, limitNumber);
  }

  @Put(":id/roles")
  @ApiOperation({
    summary: "Assign roles to user",
    description: "Assigns the specified roles to a user.",
  })
  @ApiResponse({ status: 200, description: "Roles assigned successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async assignRoles(
    @Param("id") id: string,
    @Body() assignRolesDto: AssignRolesDto
  ) {
    return this.userService.assignRoles(id, assignRolesDto);
  }
}
