import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../dto/create-user.dto";

@Controller("user")
@ApiTags("Users")
export class UserController {
  constructor(private readonly userRepo: UserService) {}
  @Post()
  @ApiOperation({ summary: "Crea un usuario", description: "Crea un usuario." })
  async createUser(
    @Body() body: CreateUserDTO,
  ): Promise<{ message: string; id: number }> {
    return this.userRepo.create(body);
  }
}
