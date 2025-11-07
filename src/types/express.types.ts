import { Request } from 'express';
import { LoginDto } from '../dtos/auth.dto';
import { AddMovieDto } from '../dtos/movies.dto';
import { CreateUserDto } from '../dtos/user.dto';
import { AuthRequest } from '../middlewares/auth.middleware';

export interface TypedRequestBody<T> extends AuthRequest {
  body: T;
}

export type CreateMovieRequest = TypedRequestBody<AddMovieDto>


export interface TypedPublicRequestBody<T> extends Request {
  body: T;
}
export type CreateUserRequest = TypedPublicRequestBody<CreateUserDto>;
export type LoginDtoRequest = TypedPublicRequestBody<LoginDto>
