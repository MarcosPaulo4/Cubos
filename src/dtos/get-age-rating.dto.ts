import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class GetAgeRatingDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
  @IsString()
  @IsNotEmpty()
  code!: string;
  @IsString()
  @IsNotEmpty()
  label!: string;
  @IsString()
  @IsOptional()
  description?: string;
}