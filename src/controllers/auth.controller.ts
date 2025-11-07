import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDtoRequest } from '../types/express.types';

export class AuthController {
  private authService = AuthService.getInstance();
  async login(req: LoginDtoRequest, res: Response) {
    try {
      const { identifier, password } = req.body;
      const result = await this.authService.login(identifier, password);

      this.setAuthCookies(res, result.token, result.refreshToken);

      return res.json({
        user: result.user,
      });

    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token não encontrado' });
      }

      const result = await this.authService.refreshToken(refreshToken);
      this.setAuthCookies(res, result.token, result.refreshToken);

      return res.json({ user: result.user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logout realizado com sucesso' });
  }

  private setAuthCookies(res: Response, token: string, refreshToken: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.cookie('token', token, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }

}