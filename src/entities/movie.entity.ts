import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MovieStatus } from "../enum/movie-status.enum";
import { AgeRating } from "./age-rating.entity";
import { MovieGenre } from "./movie-gender.entity";
import { User } from "./user.entity";

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.movies, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column()
  userId!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  originalTitle?: string;

  @Column({ type: "text", nullable: true })
  synopsis?: string;

  @Column({ nullable: true })
  coverUrl?: string;

  @Column({ nullable: true })
  trailerUrl?: string;

  @ManyToOne(() => AgeRating, (ageRating) => ageRating.movies, {
    nullable: true,
  })
  @JoinColumn({ name: "ageRatingId" })
  ageRating?: AgeRating;

  @Column({ nullable: true })
  ageRatingId?: string;

  @Column({ default: 0 })
  votes!: number;

  @Column({ type: "int", nullable: true })
  duration?: number;

  @Column("text", { array: true, nullable: true })
  language?: string[];

  @Column({
    type: "enum",
    enum: MovieStatus,
    default: MovieStatus.RELEASED,
  })
  status!: MovieStatus;

  @Column({ type: "float", nullable: true })
  budget?: number;

  @Column({ type: "float", nullable: true })
  revenue?: number;

  @Column({ type: "float", nullable: true })
  profit?: number;

  @Column({ type: "timestamp", nullable: true })
  releaseDate?: Date;

  @OneToMany(() => MovieGenre, (mg) => mg.movie)
  genres!: MovieGenre[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
