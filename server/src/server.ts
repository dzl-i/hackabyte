// Server imports
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'http';
import multer from 'multer';

// Swagger
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Route imports
import { lectureDetails } from './lecture/details';
import { lectureUploadTranscript } from './lecture/uploadTranscript';
import { lectureUploadVideo } from './lecture/uploadVideo';
import { lectureFlashcard } from './lecture/flashcard';
import { processVTT } from './lecture/vttRefiner';


interface MulterRequest extends Request {
  file?: Express.Multer.File;
}


// Set up web app using JSON
const app = express();
app.use(express.json({ limit: '50mb' }));

const upload = multer({ storage: multer.memoryStorage() });

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

// LECTURE ROUTES

// Get lecture details
app.get('/lecture/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const lecture = await lectureDetails(id);

    res.status(200).json(lecture);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

// Upload lecture transcript
app.post('/lecture/transcript', upload.single('file'), async (req: MulterRequest, res: Response) => {
  try {
    const id = req.body.id;
    const title = req.file?.originalname || '';
    const rawTranscript = req.file?.buffer.toString('utf8') || '';

    const refinedTranscript = processVTT(rawTranscript);
    const lecture = await lectureUploadTranscript(title, refinedTranscript);

    res.status(200).json(lecture);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

// Upload lecture video
app.post('/lecture/video', upload.single('file'), async (req: MulterRequest, res: Response) => {
  try {
    const title = req.file?.originalname || '';
    const video = req.file;

    if (!video) throw { status: 400, message: "Video file is required." };

    const lecture = await lectureUploadVideo(title, video);

    res.status(200).json(lecture);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
});

// Create a new flashcard based on selected text
app.post('/lecture/flashcard', async (req: Request, res: Response) => {
  try {
    const { sectionId, text } = req.body;

    const flashcard = await lectureFlashcard(sectionId, text);

    res.status(200).json(flashcard);
  } catch (error: any) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || "An error occurred." });
  }
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
