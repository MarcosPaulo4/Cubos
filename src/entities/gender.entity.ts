import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieGenre } from "./movie-gender.entity";

@Entity("genres")
export class Genre {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => MovieGenre, (mg) => mg.genre)
  movieGenres!: MovieGenre[];
}
