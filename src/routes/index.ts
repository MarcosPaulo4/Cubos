import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";

const router = Router()

router.use('/users', userRouter);
router.use('/auth', authRouter);

export { router as apiRouter };
