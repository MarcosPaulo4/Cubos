import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { AgeRatingService } from "../services/age-rating.service";

export class AgeRatingController {
  private ageRatingService = AgeRatingService.getInstance()

  public list = async(
    req: AuthRequest,
      res: Response,
      next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Não autorizado" });
        }
      const result = await this.ageRatingService.list()
      return res.json(result)
    } catch (error) {
       next(error);
    }
  }
}