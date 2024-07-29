import { Request, Response, NextFunction } from 'express';

interface HttpError extends Error {
  status?: number;
}

export function errorMiddleware(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  
  console.error(`Error: ${message}, Status Code: ${status}`);

  res.status(status).json({
    status,
    message,
  });
}
