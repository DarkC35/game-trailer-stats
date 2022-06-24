/*
  Warnings:

  - The primary key for the `Statistic` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Statistic" DROP CONSTRAINT "Statistic_pkey",
ADD CONSTRAINT "Statistic_pkey" PRIMARY KEY ("date", "trailerId");
