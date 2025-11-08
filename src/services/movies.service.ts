import { EntityManager, In, Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { MovieFiltersDto } from "../dtos/movies-filter.dto";
import { AddMovieDto } from "../dtos/movies.dto";
import { AgeRating } from "../entities/age-rating.entity";
import { Genre } from "../entities/gender.entity";
import { MovieGenre } from "../entities/movie-gender.entity";
import { MovieReminder } from "../entities/movie-reminder.entity";
import { Movie } from "../entities/movie.entity";
import { User } from "../entities/user.entity";
import { ValidationError } from "../types/error.types";

export class MovieService {
  private static instance: MovieService;

  private constructor() {}

  public static getInstance(): MovieService {
    if (!MovieService.instance) {
      MovieService.instance = new MovieService();
    }
    return MovieService.instance;
  }

  async saveMovie(userId: string, data: AddMovieDto): Promise<Movie> {
  if (!data.title || !data.status || !data.genreIds?.length) {
    throw new ValidationError(
      "Título, status e pelo menos um gênero são obrigatórios"
    );
  }

  return AppDataSource.transaction(async (manager) => {
    const user = await manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new ValidationError("Usuário não encontrado");
    }

    const existing = await manager.findOne(Movie, {
      where: { title: data.title.trim(), userId },
    });

    if (existing) {
      throw new ValidationError(
        "Já existe um filme com esse título cadastrado para este usuário"
      );
    }

    const ageRating = await this.getAgeRatingOrThrow(data.ageRatingId, manager);
    const genres = await this.getGenresOrThrow(data.genreIds, manager);

    const movie = manager.create(Movie, {
      userId,
      title: data.title.trim(),
      originalTitle: data.originalTitle?.trim(),
      synopsis: data.synopsis,
      coverUrl: data.coverUrl,
      trailerUrl: data.trailerUrl,
      ageRatingId: ageRating.id,
      duration: data.duration,
      language: data.language,
      status: data.status,
      releaseDate: data.releaseDate
        ? new Date(data.releaseDate)
        : undefined,
    });

    const savedMovie = await manager.save(movie);

    const movieGenres = genres.map((genre) =>
      manager.create(MovieGenre, {
        movie: savedMovie,
        genre,
      })
    );
    await manager.save(movieGenres);

    if (savedMovie.releaseDate) {
      const today = new Date();
      const release = new Date(savedMovie.releaseDate);

      if (release > today) {
        const remindAt = release.toISOString().slice(0, 10); 

        const reminder = manager.create(MovieReminder, {
          user_id: user.id,
          movie_id: savedMovie.id,
          remindAt,
        });

        await manager.save(reminder);
      }
    }

    const movieWithRelations = await manager.findOne(Movie, {
      where: { id: savedMovie.id },
      relations: {
        ageRating: true,
        genres: { genre: true },
      },
    });

    if (!movieWithRelations) {
      throw new Error("Erro ao carregar filme criado");
    }

    return movieWithRelations;
  });
}


  async getMovies(userId: string, filters: MovieFiltersDto) {
    const page = filters.page ? parseInt(filters.page, 10) : 1
    const perPage = filters.perPage ? parseInt(filters.perPage, 10) : 10
    

    const qb = AppDataSource.getRepository(Movie)
      .createQueryBuilder('movie')
      .leftJoinAndSelect("movie.ageRating", "ageRating")
      .leftJoinAndSelect("movie.genres", "movieGenre")
      .leftJoinAndSelect("movieGenre.genre", "genre")
      .where("movie.userId = :userId", { userId });
    
    if (filters.search) {
      qb.andWhere(
        "(LOWER(movie.title) LIKE :search OR LOWER(movie.originalTitle) LIKE :search)",
        { search: `%${filters.search.toLowerCase()}%` }
      );
    }

    if (filters.minDuration) {
      qb.andWhere("movie.duration >= :minDuration", {
        minDuration: Number(filters.minDuration),
      });
    }

    if (filters.maxDuration) {
      qb.andWhere("movie.duration <= :maxDuration", {
        maxDuration: Number(filters.maxDuration),
      });
    }

    if (filters.startDate) {
      qb.andWhere("movie.releaseDate >= :startDate", {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      qb.andWhere("movie.releaseDate <= :endDate", {
        endDate: filters.endDate,
      });
    }

    if (filters.status) {
      qb.andWhere("movie.status = :status", { status: filters.status });
    }

    if (filters.ageRatingId) {
      qb.andWhere("movie.ageRatingId = :ageRatingId", {
        ageRatingId: filters.ageRatingId,
      });
    }

    if (filters.genreId) {
      qb.andWhere("genre.id = :genreId", { genreId: filters.genreId });
    }

    qb.orderBy("movie.created_at", "DESC")
      .skip((page - 1) * perPage)
      .take(perPage);
    
    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }


async updateMovie(
    userId: string,
    movieId: string,
    data: Partial<AddMovieDto>
  ): Promise<Movie> {
    return AppDataSource.transaction(async (manager) => {
      const movie = await manager.findOne(Movie, {
        where: { id: movieId, userId },
        relations: { genres: { genre: true } },
      });

      if (!movie) {
        throw new ValidationError("Filme não encontrado ou não permitido");
      }

      if (data.title) {
        const exists = await manager.findOne(Movie, {
          where: {
            id: Not(movieId),
            userId,
            title: data.title.trim(),
          },
        });
        if (exists) {
          throw new ValidationError(
            "Já existe outro filme com esse título para este usuário"
          );
        }
        movie.title = data.title.trim();
      }

      if (data.originalTitle !== undefined) {
        movie.originalTitle = data.originalTitle.trim() ;
      }

      if (data.synopsis !== undefined) movie.synopsis = data.synopsis;
      if (data.trailerUrl !== undefined) movie.trailerUrl = data.trailerUrl ;
      if (data.duration !== undefined) movie.duration = data.duration;
      if (data.status !== undefined) movie.status = data.status;
      if (data.coverUrl !== undefined) movie.coverUrl = data.coverUrl;

      if (data.releaseDate !== undefined) {
        movie.releaseDate = new Date(data.releaseDate)
         ;
      }

      if (data.ageRatingId) {
        const ageRating = await this.getAgeRatingOrThrow(
          data.ageRatingId,
          manager
        );
        movie.ageRatingId = ageRating.id;
      }

      if (data.genreIds) {
        const genres = await this.getGenresOrThrow(data.genreIds, manager);

        await manager.delete(MovieGenre, { movie: { id: movie.id } });

        const movieGenres = genres.map((genre) =>
          manager.create(MovieGenre, { movie, genre })
        );
        await manager.save(movieGenres);
      }

      const saved = await manager.save(movie);

      const movieWithRelations = await manager.findOne(Movie, {
        where: { id: saved.id },
        relations: {
          ageRating: true,
          genres: { genre: true },
        },
      });

      if (!movieWithRelations) {
        throw new Error("Erro ao carregar filme atualizado");
      }

      return movieWithRelations;
    });
  }

  async deleteMovie(userId: string, movieId: string): Promise<void> {
    return AppDataSource.transaction(async (manager) => {
      const movie = await manager.findOne(Movie, {
        where: { id: movieId, userId },
      });

      if (!movie) {
        throw new ValidationError("Filme não encontrado ou não permitido");
      }

      await manager.delete(MovieGenre, { movie: { id: movie.id } });
      await manager.delete(Movie, { id: movie.id });
    });
  }

    async getMovieById(userId: string, movieId: string): Promise<Movie> {
    const movie = await AppDataSource.getRepository(Movie).findOne({
      where: { id: movieId, userId }, 
      relations: {
        ageRating: true,
        genres: { genre: true },
      },
    });

    if (!movie) {
      throw new ValidationError("Filme não encontrado"); 
    }

    return movie;
  }

  private async getAgeRatingOrThrow(ageRatingId: string, manager: EntityManager): Promise<AgeRating> {
    if (!ageRatingId) {
      throw new ValidationError("Classificação indicativa é obrigatória");
    }

    const ageRating = await manager.findOne(AgeRating, {
      where: { id: ageRatingId },
    });

    if (!ageRating) {
      throw new ValidationError("Classificação indicativa inválida");
    }

    return ageRating;
  }

  private async getGenresOrThrow(genreIds: string[], manager: EntityManager):Promise<Genre[]> {
    if (!genreIds?.length) {
      throw new ValidationError("Pelo menos um gênero é obrigatório");
    }

    const genres = await manager.find(Genre, {
      where: { id: In(genreIds) },
    });

    if (!genres.length) {
      throw new ValidationError("Nenhum gênero válido encontrado");
    }

    if (genres.length !== genreIds.length) {
      throw new ValidationError(
        "Um ou mais gêneros informados são inválidos"
      );
    }

    return genres;
  }
}
