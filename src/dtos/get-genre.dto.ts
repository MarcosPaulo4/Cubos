import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetGenreDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string
}