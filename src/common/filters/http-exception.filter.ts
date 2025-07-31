import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Get the context for HTTP requests
    const response = ctx.getResponse<Response>(); // Response object
    const request = ctx.getRequest<Request>(); // Request object
    const status = exception.getStatus(); 

    const errorResponse = exception.getResponse();
    const errorMessage =
      typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message || 'Internal server error';

    // Custom error messages based on status code
    const customErrorMessages = {
      [HttpStatus.BAD_REQUEST]: 'Bad request - missing or invalid data',
      [HttpStatus.UNAUTHORIZED]: 'Authentication required - please login',
      [HttpStatus.FORBIDDEN]: 'Access denied - insufficient permissions',
      [HttpStatus.NOT_FOUND]: 'Requested resource not found',
      [HttpStatus.CONFLICT]: 'Conflict - resource already exists',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
    };
    const englishMessage = customErrorMessages[status] || errorMessage;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: {
        type: HttpStatus[status],
        message: englishMessage,
        originalMessage: errorMessage,
      },
    });
  }
}
