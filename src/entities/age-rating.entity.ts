import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";

@Entity("age_ratings")
export class AgeRating {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  code!: string; 

  @Column()
  label!: string; 

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Movie, (movie) => movie.ageRating)
  movies!: Movie[];
}
