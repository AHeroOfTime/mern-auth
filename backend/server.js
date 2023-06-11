import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;
import userRoutes from './routes/userRoutes.js';
// connect to db
connectDB();

// initialize app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth middleware
app.use(cookieParser());

app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // making dist folder a static folder
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

  // any route that we hit thats not api/users is going to load that index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')),
  );
} else {
  // adding a route
  app.get('/', (req, res) => res.send('Server is ready'));
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
