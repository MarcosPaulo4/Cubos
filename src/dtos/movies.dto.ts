import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { MovieStatus } from "../enum/movie-status.enum";

export class AddMovieDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  originalTitle?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsString()
  @IsOptional()
  trailerUrl?: string;

  @IsUUID()
  @IsNotEmpty()
  ageRatingId!: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  duration!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  language?: string[];

  @IsEnum(MovieStatus)
  @IsNotEmpty()
  status!: MovieStatus;

  @IsDateString()
  @IsOptional()
  releaseDate?: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  genreIds!: string[];
}
