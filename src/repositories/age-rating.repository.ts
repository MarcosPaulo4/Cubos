import { AppDataSource } from "../data-source";
import { AgeRating } from "../entities/age-rating.entity";

export const AgeRatingRepository  = AppDataSource.getRepository(AgeRating)