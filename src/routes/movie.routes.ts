import { Router } from "express";
import { MovieController } from "../controllers/movies.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const movieRouter = Router();
const movieController = new MovieController();

movieRouter.post("/create", isAuthenticated, movieController.create);
movieRouter.get("/", isAuthenticated, movieController.list);

export { movieRouter };
