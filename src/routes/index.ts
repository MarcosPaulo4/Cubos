import { Router } from "express";
import { authRouter } from "./auth.routes";
import { movieRouter } from "./movie.routes";
import { userRouter } from "./user.routes";

const router = Router()

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use("/movies", movieRouter);

export { router as apiRouter };
