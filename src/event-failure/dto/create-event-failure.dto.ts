import { ApiProperty } from "@nestjs/swagger";

export class CreateEventFailureDto {
  @ApiProperty()
  name: string;
}
