import { AppDataSource } from "../data-source";
import { Genre } from "../entities/gender.entity";

export const GenreRepository  = AppDataSource.getRepository(Genre)