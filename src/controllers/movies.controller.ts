import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Response } from "express";
import { MovieFiltersDto } from "../dtos/movies-filter.dto";
import { AddMovieDto } from "../dtos/movies.dto";
import { UpdateMovieDto } from "../dtos/updated-movie.dto";
import { AuthRequest } from "../middlewares/auth.middleware";
import { MovieService } from "../services/movies.service";
import { uploadMovieCover } from "../utils/s3";

export class MovieController {
  private movieService = MovieService.getInstance()


async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
      }
      let coverUrl: string | undefined;
      if (req.file) {
        coverUrl = await uploadMovieCover(req.file);
      }
      const payload: AddMovieDto = {
        ...req.body,
        coverUrl,
        genreIds: Array.isArray(req.body.genreIds)
          ? req.body.genreIds
          : typeof req.body.genreIds === "string"
          ? [req.body.genreIds]
          : [],
      };

      const dto = plainToInstance(AddMovieDto, payload);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const messages = errors.flatMap((e) =>
          Object.values(e.constraints || {})
        );
        return res.status(400).json({ message: "Dados inválidos", errors: messages });
      }

      const movie = await this.movieService.saveMovie(req.user.id, dto);

      return res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  }

  public show = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const movie = await this.movieService.getMovieById(
        req.user.id,
        req.params.id
      );

      return res.json(movie);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      const dto = plainToInstance(UpdateMovieDto, {
        ...req.body,
      });
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const messages = errors.flatMap((e) =>
          Object.values(e.constraints || {})
        );
        return res
          .status(400)
          .json({ message: "Dados inválidos", errors: messages });
      }

      const updated = await this.movieService.updateMovie(
        req.user.id,
        req.params.id,
        dto
      );

      return res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
      }

      await this.movieService.deleteMovie(req.user.id, req.params.id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };


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