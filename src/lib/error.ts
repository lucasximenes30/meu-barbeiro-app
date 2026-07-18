import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { errorResponse } from './response';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return errorResponse(error.message, null, error.statusCode);
  }

  if (error instanceof ZodError) {
    return errorResponse('Erro de validação', error.format(), 400);
  }

  // Handle Prisma errors generically without exposing DB details
  if (error instanceof Error && error.name.includes('Prisma')) {
    return errorResponse('Erro no banco de dados', null, 500);
  }

  return errorResponse('Erro interno do servidor', null, 500);
}
