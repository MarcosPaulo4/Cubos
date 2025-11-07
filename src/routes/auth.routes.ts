import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { LoginDto } from '../dtos/auth.dto';
import { validateDto } from '../middlewares/validate.middleware';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', validateDto(LoginDto), authController.login.bind(authController));
authRouter.post('/refresh-token', authController.refreshToken.bind(authController));
authRouter.post('/logout', authController.logout.bind(authController));

export { authRouter };
