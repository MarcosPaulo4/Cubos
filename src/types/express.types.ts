import { Request } from 'express';
import { LoginDto } from '../dtos/auth.dto';
import { CreateUserDto } from '../dtos/user.dto';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export type CreateUserRequest = TypedRequestBody<CreateUserDto>;
export type LoginDtoRequest = TypedRequestBody<LoginDto>