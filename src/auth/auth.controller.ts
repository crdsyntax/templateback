import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Autenticated")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({
    summary: "Autenticacion de usuario",
    description: "Autenticacion con `username` y `password`",
  })
  @ApiBody({
    description: "Usuario y contraseña para autenticación",
    schema: {
      type: "object",
      properties: {
        username: { type: "string", example: "johndoe" },
        password: { type: "string", example: "supersecret" },
      },
      required: ["username", "password"],
    },
  })
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) throw new UnauthorizedException("Invalid credentials");

    return this.authService.login(user);
  }
}
