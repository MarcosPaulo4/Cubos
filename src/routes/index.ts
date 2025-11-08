import { Router } from "express";
import { ageRating } from "./age-rating.routes";
import { authRouter } from "./auth.routes";
import { genreRouter } from "./genre.routes";
import { movieRouter } from "./movie.routes";
import { userRouter } from "./user.routes";

const router = Router()

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/movies', movieRouter);
router.use('/genres', genreRouter)
router.use('/age-rating', ageRating)

export { router as apiRouter };
