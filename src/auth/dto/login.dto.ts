import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "Nombre de usuario", example: "johndoe" })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ description: "Contraseña", example: "supersecret" })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  password: string;
}
