import bcrypt from 'bcrypt';
import { CreateUserDto } from "../dtos/user.dto";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { ValidationError } from '../types/error.types';

export class UserService {
  private static instance: UserService;
  private readonly saltRounds = 10;
  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async createUser(data: CreateUserDto): Promise<Omit<User, 'hashPassword'>> {
    if (!data.email || !data.password || !data.name) {
      throw new ValidationError('Todos os campos são obrigatórios');
    }

    if (data.password.length < 6) {
      throw new ValidationError('A senha deve ter pelo menos 6 caracteres');
    }

    const queryRunner = UserRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email: data.email },
        select: ['id'], 
        lock: { mode: 'pessimistic_write' } 
      });

      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      const hashPassword = await bcrypt.hash(data.password, this.saltRounds);

      const user = UserRepository.create({
        email: data.email.toLowerCase().trim(),
        name: data.name.trim(),
        hashPassword
      });

      const savedUser = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      const { hashPassword: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      
      if (error instanceof Error) {
        throw error; 
      }
      throw new Error('Erro ao criar usuário');

    } finally {
      await queryRunner.release();
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new Error('Email é obrigatório');
    }
    try {
      return await UserRepository.findOne({ 
        where: { email: email.toLowerCase().trim() },
        cache: true 
      });
    } catch (error) {
      throw new Error('Erro ao buscar usuário');
    }
  }



}