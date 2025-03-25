/*
  Warnings:

  - You are about to drop the column `graph` on the `Section` table. All the data in the column will be lost.
  - Added the required column `graph` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp_end` to the `Section` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp_start` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "graph" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "graph",
ADD COLUMN     "timestamp_end" TEXT NOT NULL,
ADD COLUMN     "timestamp_start" TEXT NOT NULL;
