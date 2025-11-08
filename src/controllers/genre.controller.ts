import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { GenreService } from "../services/genres.service";

export class GenreController {
  private genreService = GenreService.getInstance()

  public list = async(
    req: AuthRequest,
      res: Response,
      next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
        }
      const result = await this.genreService.getGenres()
      return res.json(result)
    } catch (error) {
       next(error);
    }
  }
}