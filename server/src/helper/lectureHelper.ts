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