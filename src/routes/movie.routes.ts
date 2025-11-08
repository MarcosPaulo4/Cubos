import { Router } from "express";
import { upload } from "../config/multer";
import { MovieController } from "../controllers/movies.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.use(isAuthenticated);

movieRouter.post(
  "/",
  upload.single("cover"),
  (req, res, next) => movieController.create(req, res, next)
);

movieRouter.get(
  "/",
  (req, res, next) => movieController.list(req, res, next)
);

movieRouter.get(
  "/:id",
  (req, res, next) => movieController.show(req, res, next)
);

movieRouter.put(
  "/:id",
  upload.single("cover"),
  (req, res, next) => movieController.update(req, res, next)
);

movieRouter.delete(
  "/:id",
  (req, res, next) => movieController.delete(req, res, next)
);

export { movieRouter };
