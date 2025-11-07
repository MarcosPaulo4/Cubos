import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Response } from "express";
import { MovieFiltersDto } from "../dtos/movies-filter.dto";
import { AuthRequest } from "../middlewares/auth.middleware";
import { MovieService } from "../services/movies.service";
import { CreateMovieRequest } from "../types/express.types";

export class MovieController {
  private movieService = MovieService.getInstance()


  async create(
    req: CreateMovieRequest,
    res: Response,
    next: NextFunction
  ) {
     try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const movie = await this.movieService.saveMovie(req.user.id, req.body);

      return res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  }


  public list = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const dto = plainToInstance(MovieFiltersDto, req.query);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const messages = errors.flatMap((e) =>
          Object.values(e.constraints || {})
        );
        return res.status(400).json({ message: "Parâmetros inválidos", errors: messages });
      }

      const result = await this.movieService.getMovies(req.user.id, dto);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}