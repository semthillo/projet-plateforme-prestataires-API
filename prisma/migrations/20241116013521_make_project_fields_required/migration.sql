/*
  Warnings:

  - Made the column `domain_id` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "domain_id" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;
