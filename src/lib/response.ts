import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  timestamp: string;
}

export function successResponse<T>(data: T, message = 'Success', status = 200) {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}

export function errorResponse(message: string, errors?: any, status = 400) {
  const response: ApiResponse<null> = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status });
}
