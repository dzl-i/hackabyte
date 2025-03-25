/*
  Warnings:

  - You are about to drop the column `lectureId` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `graph` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `transcript` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lecture` table. All the data in the column will be lost.
  - Added the required column `sectionId` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_lectureId_fkey";

-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "lectureId",
ADD COLUMN     "sectionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "graph",
DROP COLUMN "summary",
DROP COLUMN "transcript",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "graph" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
