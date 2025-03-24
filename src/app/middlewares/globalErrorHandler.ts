import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors/ApiError';
import { responseTime } from '../utils/responseUtils';

export const globalErrorHandler: ErrorRequestHandler = (error, request: Request, response: Response, next: NextFunction) => {

    const startTime = request.requestStartTime as number;

    // If it's an instance of ApiError, use the custom message and status code
    if (error instanceof ApiError) {

        const {
            message,
            source
        } = error.errorDetails;  // Extracting message and source from errorDetails

        return response.status(error.statusCode).json({
            status: error.statusCode,
            success: false,
            responseTime: responseTime(startTime),
            source: source || 'Unknown source',  // Fallback source
            message: message || 'An error occurred',  // Fallback message
        });
    }

    // For other errors (e.g. server errors)
    const statusCode = error.statusCode || 500;
    const defaultMessage = 'Something went wrong!';

    return response.status(statusCode).json({
        status: statusCode,
        success: false,
        responseTime: `${Date.now() - startTime}ms`,
        message: error.message || defaultMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};