import { User } from "../entities/user.entity";
export interface LoginResponse {
  user: Omit<User, 'hashPassword'>;
  token: string;
  refreshToken: string;
}