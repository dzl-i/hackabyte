import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getLectureDetail(id: string) {
  return prisma.lecture.findUnique({
    where: {
      id: id
    },
    include: {
      sections: {
        include: {
          flashcards: true
        },
      },
    },
  });
}

export async function createLecture(title: string, graph: string) {
  return await prisma.lecture.create({
    data: {
      title: title,
      graph: graph,
    }
  });
}

export async function createSection(lectureId: string, title: string, transcript: string, timestamp_start: string, timestamp_end: string, summary: string) {
  return await prisma.section.create({
    data: {
      title: title,
      transcript: transcript,
      timestamp_start: timestamp_start,
      timestamp_end: timestamp_end,
      summary: summary,
      lecture: {
        connect: {
          id: lectureId
        }
      }
    }
  });
}

export async function createFlashcard(sectionId: string, question: string, answer: string) {
  return await prisma.flashcard.create({
    data: {
      question: question,
      answer: answer,
      section: {
        connect: {
          id: sectionId
        }
      }
    }
  });
}
