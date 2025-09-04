import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDTO {
  @ApiProperty({
    description: "username",
    example: "usernameexample",
    maxLength: 30,
    minLength: 3,
  })
  @IsString({ message: "Ingrese un nombre de usuario valido." })
  username: string;

  @ApiProperty({
    description: "username",
    example: "usernameexample",
    maxLength: 30,
    minLength: 3,
  })
  @IsString({ message: "Ingrese un nombre de usuario valido." })
  name: string;

  @ApiProperty({
    description: "Email para registro de usuario",
    example: "email",
  })
  @IsEmail({}, { message: "Ingrese un email valido." })
  email?: string;

  @ApiPropertyOptional({
    description: "description",
    example: "email",
  })
  @IsString({ message: "Proporcione una contraseña valida." })
  password?: string;
}
