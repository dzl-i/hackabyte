/*
  Warnings:

  - Added the required column `summary` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "summary" TEXT NOT NULL;
