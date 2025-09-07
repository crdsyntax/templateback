import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class AssignRolesDto {
  @ApiProperty({
    description: "Array of role IDs to assign to the user",
    example: ["64f1b5a9e6b3d1a9c9f1b5a9"],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
