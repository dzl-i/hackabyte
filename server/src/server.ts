// Server imports
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';

// Swagger
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


// Route imports


// Database client
const prisma = new PrismaClient();

// Set up web app using JSON
const app = express();
app.use(express.json({ limit: '50mb' }));

const httpServer = new Server(app);

// Use middleware that allows for access from other domains
app.use(cors({
  origin: ["http://localhost:3001"],
  credentials: true
}));


const PORT: number = parseInt(process.env.PORT || '3000');
const isProduction: boolean = process.env.NODE_ENV === "production";

const swaggerDocument = YAML.load(path.join(__dirname, '../api-docs.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


///////////////////////// ROUTES /////////////////////////


// HEALTH CHECK ROUTE
app.get('/', async (req: Request, res: Response) => {
  console.log("Health check")
  res.status(200).json({
    message: "Server is up!"
  });
});


///////////////////////// SERVER /////////////////////////


// Logging errors
app.use(morgan('dev'));

app.use(errorHandler());

// Start server
const server = httpServer.listen(PORT, () => {
  console.log(`⚡️ Server listening on port ${PORT}`);
});

// For coverage, handle Ctrl+C
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server.'));
});
