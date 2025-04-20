/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { TErrorSources } from '../types/error';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import { requestResponseTime } from '../utils/responseUtils';
import { AppError } from '../errors/ApiError';

export const globalErrorHandler: ErrorRequestHandler = (error, request: Request, response: Response, next: NextFunction) => {

    const startTime = request.requestStartTime as number;

    let statusCode = error.status || 500
    let message = error.message || 'something went wrong'
    let errorSources: TErrorSources = {
        path: '',
        message: ['something went wrong']
    }

    // Zod Errors
    if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.status
        message = simplifiedError.message
        errorSources = simplifiedError.error
    }
    // Custom App error
    else if (error instanceof AppError) {
        message = error?.customError;
        errorSources = {
            path: 'APP',
            message: [error?.message],
        };
    }

    // Response Global Error
    response.status(statusCode).json({
        responseTime: requestResponseTime(startTime),
        success: false,
        status: statusCode,
        message,
        error: errorSources,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    return
};