import stream from 'stream';
import OpenAI from 'openai';
import { lectureUploadTranscript } from './uploadTranscript';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function lectureUploadVideo(title: string, video: Express.Multer.File) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(video.buffer);

  // Process Audio to Text (Transcript)
  const transcript = await transcribeAudio(bufferStream);
  console.log(transcript);

  // Process Transcript
  const lecture = await lectureUploadTranscript(title, transcript);

  return lecture;
}

const transcribeAudio = async (bufferStream) => {
  // Using https://platform.openai.com/docs/guides/speech-to-text?lang=javascript
  const transcription = await client.audio.transcriptions.create({
    file: bufferStream,
    model: "whisper-1",
    language: "en",
    response_format: "vtt",
  });

  if (!transcription) throw { status: 500, message: "Transcription failed" };

  return transcription;
};
