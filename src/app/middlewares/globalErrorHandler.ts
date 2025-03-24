// src/app/middlewares/globalErrorHandler.ts
import { ErrorRequestHandler } from 'express';

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';

    return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
