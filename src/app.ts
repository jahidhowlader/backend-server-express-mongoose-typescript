import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { requestLogger } from './app/libs/logger';
import { requestTime } from './app/middlewares/requestTime';
import rateLimiter from './app/libs/rateLimit';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
const app: Application = express();

app.use(requestLogger); // loger
app.use(rateLimiter); // Rate Limit
app.use(requestTime) // Inject Request Time Start

// parsers
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
