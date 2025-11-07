import { Response } from 'express';
import { UserService } from "../services/user.service";
import { CreateUserRequest } from '../types/express.types';

export class UserController {
  private userService = UserService.getInstance();

  async create(req: CreateUserRequest, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({message: error.message})
      } else {
        res.status(500).json({message: 'Erro interno do servidor'})
       }

    }
  }
}