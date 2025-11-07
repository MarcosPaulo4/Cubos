export class MovieService {
  private static instance: MovieService;
  private constructor() { }
  
  public static getInstance(): MovieService {
        if (!MovieService.instance) {
      MovieService.instance = new MovieService();
    }
    return MovieService.instance;
  }
}