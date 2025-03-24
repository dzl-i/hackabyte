import { createFlashcard } from "../helper/lectureHelper";

export async function lectureFlashcard(sectionId: string, text: string) {
  try {
    const response = await fetch(`chatgpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });
    
    if (!response.ok) throw { status: 500, message: "Flashcard generation failed" };
    const data: any = await response.json();
    
    const flashcard = await createFlashcard(sectionId, data.question, data.answer); // TODO: also check if this is the correct format
    if (flashcard === null) throw { status: 500, message: "Flashcard generation failed" };

    return flashcard;
  } catch (error: any) {
    throw { status: 500, message: "An error occurred." };
  }
}