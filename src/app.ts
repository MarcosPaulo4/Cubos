import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cron from "node-cron";
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { sendReleaseReminders } from './jobs/send-release-reminder';
import { errorHandler } from './middlewares/error.middleware';
import { apiRouter } from './routes';

dotenv.config();

cron.schedule("0 9 * * *", async () => {
  await sendReleaseReminders();
});

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
];

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch((err) => console.error('DB error', err));
