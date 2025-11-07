import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  hashPassword!: string;

  @OneToMany(() => Movie, (movie) => movie.user, { onDelete: 'CASCADE' })
  movies?: Movie[];

  @CreateDateColumn()
  created_at!: Date;
}
