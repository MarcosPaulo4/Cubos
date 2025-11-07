import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Genre } from "./gender.entity";
import { Movie } from "./movie.entity";

@Entity("movie_genres")
export class MovieGenre {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Movie, (movie) => movie.genres, { onDelete: "CASCADE" })
  @JoinColumn({ name: "movieId" })
  movie!: Movie;

  @ManyToOne(() => Genre, (genre) => genre.movieGenres, { onDelete: "CASCADE" })
  @JoinColumn({ name: "genreId" })
  genre!: Genre;
}
