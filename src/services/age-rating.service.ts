import { GetAgeRatingDto } from "../dtos/get-age-rating.dto";
import { AgeRatingRepository } from "../repositories/age-rating.repository";

export class AgeRatingService {
  private static instance: AgeRatingService;
  private constructor() {}

  public static getInstance(): AgeRatingService {
    if (!AgeRatingService.instance) {
      AgeRatingService.instance = new AgeRatingService();
    }
    return AgeRatingService.instance;
  }

  async list(): Promise<GetAgeRatingDto[]> {
    const ageRating = await AgeRatingRepository.find({
      order: { label: "ASC" },
    });

    return ageRating.map((age) => ({
      id: age.id,
      code: age.code,
      description: age.description,
      label: age.label
    }));
  }
}
