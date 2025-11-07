import bcrypt from 'bcrypt';
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { LoginResponse } from '../types/auth.types';
import { AuthenticationError, ValidationError } from "../types/error.types";
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { UserService } from './user.service';

export class AuthService {
  private static instance: AuthService;
   private readonly userService = UserService.getInstance(); 

  private constructor() { }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance;
  }

  async login(identifier: string, password: string): Promise<LoginResponse> {
    if (!identifier || !password) {
      throw new ValidationError('Nome/E-mail e senha são obrigatórios');
    }

    const queryRunner = UserRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isEmail = identifier.includes('@');

    const user = await queryRunner.manager.findOne(User, {
      where: isEmail
        ? { email: identifier.toLowerCase().trim() }
        : { name: identifier.trim() },
      select: ['id','email', 'name', 'hashPassword'],
    });

      if (!user || !(await bcrypt.compare(password, user.hashPassword))) {
        throw new AuthenticationError('Email ou senha incorretos');
      }

      const token = generateAccessToken({ id: user.id, email: user.email })
      const refreshToken = generateRefreshToken({id: user.id, email: user.email})

      await queryRunner.commitTransaction();

      const { hashPassword, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token,
        refreshToken
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

async refreshToken(refreshToken: string): Promise<LoginResponse> {
  try {
    const payload = verifyToken(refreshToken); 

    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new AuthenticationError("Usuário não encontrado");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    const { hashPassword, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    throw new AuthenticationError("Refresh token inválido ou expirado");
  }
}

  
}