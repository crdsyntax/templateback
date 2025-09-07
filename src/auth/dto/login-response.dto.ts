import { ApiProperty } from "@nestjs/swagger";

export class RoleDto {
  @ApiProperty({ description: "ID del rol" })
  id: string;

  @ApiProperty({ description: "Nombre del rol" })
  name: string;
}

export class UserResponseDto {
  @ApiProperty({ description: "ID del usuario" })
  id: string;

  @ApiProperty({ description: "Nombre de usuario" })
  username: string;

  @ApiProperty({ description: "Nombre completo del usuario" })
  name: string;

  @ApiProperty({
    description: "Correo electrónico del usuario",
    required: false,
  })
  email?: string;

  @ApiProperty({ type: [RoleDto], description: "Roles del usuario" })
  roles: RoleDto[];
}

export class LoginResponseDto {
  @ApiProperty({ description: "Token de acceso JWT" })
  access_token: string;

  @ApiProperty({
    type: UserResponseDto,
    description: "Información del usuario autenticado",
  })
  user: UserResponseDto;
}
