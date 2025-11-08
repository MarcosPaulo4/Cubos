import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Movie } from "./movie.entity";
import { User } from "./user.entity";

@Entity("movie_reminders")
export class MovieReminder {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column()
  user_id!: string;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: "movie_id" })
  movie!: Movie;

  @Column()
  movie_id!: string;

  @Column({ type: "date" })
  remindAt!: string; 

  @Column({ default: false })
  sent!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
