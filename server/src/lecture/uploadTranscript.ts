import { summarizeLecture } from "../gpt";
import { createFlashcard, createLecture, createSection, getLectureDetail } from "../helper/lectureHelper";
import { processVTT } from './vttRefiner';
import { groupTranscripts } from '../helper/chroma'

export async function lectureUploadTranscript(title: string, transcript: string) {
  const processedranscript = processVTT(transcript); // change into {timestamp} {text} format
  const stringifiedTranscript = processedranscript.rawResult;
  const listedTranscript = processedranscript.refinedResult;
  // const groupedTranscript = await groupTranscripts(refinedTranscript);
  const result: any = await summarizeLecture(stringifiedTranscript); // ChatGPT api call
  
  console.log(result);
  // if (result.status !== 200) throw { status: 500, message: "An error occurred in uploadTranscript 1." };
  const sections = result.sections;
  const graph = result.graph;

  console.log('RAHHHHHHHHHH SECTION\n');
  console.log(sections);
  console.log('RAHHHHHHHHHH SECTION\n');

  console.log('RAHHHHHHHHHH GRAPH\n');
  console.log(graph);
  console.log('RAHHHHHHHHHH GRAPH\n');

  const lecture = await createLecture(title, JSON.stringify(graph));

  const resLen = listedTranscript.length
  for (const section of sections) {
    const start = listedTranscript.findIndex(item => item.timestamp === section.timestamp_start);
    console.log('START is', start);
    const end = listedTranscript.findIndex(item => item.timestamp === section.timestamp_end);
    console.log('END is', end);
    const sectionTranscript = start !== -1 && end !== -1 ? listedTranscript.slice(start, end + 1) : [];

    const newSection = await createSection(lecture.id, section.title, JSON.stringify(sectionTranscript), section.timestamp_start, section.timestamp_end, section.summary);
    if (newSection === null) throw { status: 500, message: "An error occurred in uploadTranscript 2." };

    for (const flashcard of section.flashcards) {
      const newFlashcard = await createFlashcard(newSection.id, flashcard.question, flashcard.answer);
      if (newFlashcard === null) throw { status: 500, message: "An error occurred in uploadTranscript 3." };
    }
  }

  const lectureDetails = await getLectureDetail(lecture.id);
  if (lectureDetails === null) throw { status: 500, message: "An error occurred in uploadTranscript 4." };
  return lectureDetails;
}