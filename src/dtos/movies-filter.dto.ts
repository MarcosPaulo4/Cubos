import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { MovieStatus } from "../enum/movie-status.enum";

export class MovieFiltersDto {
  @IsNumberString()
  @IsOptional()
  page?: string; 

  @IsNumberString()
  @IsOptional()
  perPage?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumberString()
  @IsOptional()
  minDuration?: string;

  @IsNumberString()
  @IsOptional()
  maxDuration?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(MovieStatus)
  @IsOptional()
  status?: MovieStatus;

  @IsUUID()
  @IsOptional()
  ageRatingId?: string;

  @IsUUID()
  @IsOptional()
  genreId?: string; 
}
