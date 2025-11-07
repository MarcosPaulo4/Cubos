import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${error.message}`);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erro de validação',
      details: error.message
    });
  }

  if (error.name === 'QueryFailedError') {
    return res.status(400).json({
      message: 'Erro no banco de dados',
      details: 'Operação inválida'
    });
  }

  return res.status(500).json({
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
};