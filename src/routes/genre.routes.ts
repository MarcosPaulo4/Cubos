import { Router } from 'express';
import { GenreController } from '../controllers/genre.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const genreRouter = Router();
const genreController = new GenreController();

genreRouter.get('/', isAuthenticated, genreController.list);

export { genreRouter };
