import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function validateDto<T extends object>(dto: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dto, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));
      
      return res.status(400).json({
        message: 'Erro de validação',
        errors: validationErrors
      });
    }

    req.body = dtoObject;
    next();
  };
}