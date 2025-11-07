import { AppDataSource } from "../data-source";
import { Movie } from "../entities/movie.entity";

export const MovieRepository  = AppDataSource.getRepository(Movie)