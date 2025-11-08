import { Router } from 'express';
import { AgeRatingController } from '../controllers/age-rating.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const ageRating = Router();
const ageRatingController = new AgeRatingController();

ageRating.get('/', isAuthenticated, ageRatingController.list);

export { ageRating };
