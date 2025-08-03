import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandaler';
import { notFound } from './app/utils/notFound';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use('/api/v1', router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
