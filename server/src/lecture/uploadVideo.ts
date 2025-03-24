import ffmpeg from 'fluent-ffmpeg';
import stream from 'stream';
import { lectureUploadTranscript } from './uploadTranscript';

export async function lectureUploadVideo(title: string, video: Express.Multer.File) {
  // Process MP4 to Audio
  const mp3Buffer = await convertToMp3(video.buffer);

  // Process Audio to Text (Transcript)
  const transcript = await transcribeAudio(mp3Buffer);

  // Process Transcript
  const lecture = await lectureUploadTranscript(title, transcript);

  return lecture;
}

const convertToMp3 = (buffer) => {
  return new Promise((resolve, reject) => {
    const inputStream = new stream.PassThrough();
    inputStream.end(buffer);

    const outputStream = new stream.PassThrough();
    const chunks: Buffer[] = [];

    ffmpeg(inputStream)
      .format('mp3')
      .audioCodec('libmp3lame')
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(outputStream);

    outputStream.on('data', (chunk) => chunks.push(chunk));
  });
};

const transcribeAudio = async (audioBuffer) => {
  // TODO: Check out https://platform.openai.com/docs/guides/speech-to-text?lang=javascript - can we use this?
  try {
    const response = await fetch(""); // TODO: Check out https://api.openai.com/v1/audio/transcriptions
    
    if (!response.ok) throw { status: 500, message: "An error occurred during transcription." };
    const data: any = await response.json();
    
    return data.data.text; // TODO: idk if the response is in this format lol
  } catch (error: any) {
    throw { status: 500, message: "An error occurred." };
  }
};
