import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { CreateUserDto } from '../dtos/user.dto';
import { validateDto } from '../middlewares/validate.middleware';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', validateDto(CreateUserDto), userController.create.bind(userController));

export { userRouter };
