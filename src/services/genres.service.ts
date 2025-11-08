import { GetGenreDto } from "../dtos/get-genre.dto";
import { GenreRepository } from "../repositories/genre.repository";

export class GenreService {
  private static instance: GenreService;
  private constructor() {}

  public static getInstance(): GenreService {
    if (!GenreService.instance) {
      GenreService.instance = new GenreService();
    }
    return GenreService.instance;
  }

  async getGenres(): Promise<GetGenreDto[]> {
    const genres = await GenreRepository.find({
      order: { name: "ASC" },
    });

    return genres.map((g) => ({
      id: g.id,
      name: g.name,
    }));
  }
}
