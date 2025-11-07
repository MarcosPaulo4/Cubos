import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: 'Nome/Email é obrigatório' })
  @IsString({ message: 'Nome/Email inválido' })
  identifier!: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password!: string;
}