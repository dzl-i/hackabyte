import { summarizeLecture } from "../gpt";
import { createFlashcard, createLecture, createSection, getLectureDetail } from "../helper/lectureHelper";
import { processVTT } from './vttRefiner';

export async function lectureUploadTranscript(title: string, transcript: string) {
  const refinedTranscript = processVTT(transcript); // change into {timestamp} {text} format
  const result: any = await summarizeLecture(transcript); // ChatGPT api call

  if (result.status !== 200) throw { status: 500, message: "An error occurred." };
  const response = await result.json();

  const lecture = await createLecture(title, response.graph);

  for (const section of response.sections) {
    const newSection = await createSection(lecture.id, section.title, section.transcript, section.timestamp_start, section.timestamp_end, section.summary);
    if (newSection === null) throw { status: 500, message: "An error occurred." };

    for (const flashcard of section.flashcards) {
      const newFlashcard = await createFlashcard(newSection.id, flashcard.question, flashcard.answer);
      if (newFlashcard === null) throw { status: 500, message: "An error occurred." };
    }
  }

  const lectureDetails = await getLectureDetail(lecture.id);
  if (lectureDetails === null) throw { status: 500, message: "An error occurred." };

  return lectureDetails;
}