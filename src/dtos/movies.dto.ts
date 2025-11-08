import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
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

  @IsString()
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
  @IsString({ each: true })
  @IsNotEmpty()
  genreIds!: string[];
}
